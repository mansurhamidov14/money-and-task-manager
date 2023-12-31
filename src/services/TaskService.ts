import { IDBCollection, SearchCondition } from "@app/adapters/IDB";
import { taskCollection } from "@app/db";
import { OneTimeTask, RecurringTask, RecurringTaskDay, Task } from "@app/stores";
import { TaskFormSchema } from "@app/schemas";
import { NewTask } from ".";

class TaskService {
  constructor (private collection: IDBCollection<Task>) { }

  async create(user: number, task: TaskFormSchema): Promise<void> {
    const isRecurring = Number(task.isRecurring);

    if (isRecurring) {
      const records: NewTask[] = task.days!.map((day) => ({
        user,
        title: task.title,
        startDate: task.startDate,
        endDate: task.endDate,
        weekday: day.day!,
        time: day.time!,
        isRecurring: 1,
        doneAt: 0
      }));

      const originalTask = await this.collection.create(records[0]);
      if (records[1]) {
        return records.slice(1)
          .reduce((promise, record) => {
            return promise.then(() => {
              return this.collection.create({ ...record, originalId: originalTask.id });
            });
          }, Promise.resolve() as Promise<any>);
      }

      return;
    }

    await this.collection.create<NewTask>({
      user,
      title: task.title,
      isRecurring: 0,
      startDate: task.startDate,
      endDate: task.startDate,
      weekday: new Date(task.startDate).getWeekDay(),
      time: task.time!,
      doneAt: 0
    });
    return;
  }

  async getById(id: number): Promise<RecurringTask | OneTimeTask | null> {
    const originalTask = await this.collection.queryOne(id);
    if (originalTask && originalTask.isRecurring) {
      const relatedTasks = await this.collection.queryAll({ originalId: id });
      const taskDays: RecurringTaskDay[] = relatedTasks
        .reduce((acc, value) => {
          return [...acc, {
            day: value.weekday,
            time: value.time,
          }]
        }, [{
          day: originalTask.weekday,
          time: originalTask.time,
        }])
        .toSorted((a, b) => a.day < b.day ? -1 : 1);


      return {
        id: originalTask.id,
        user: originalTask.user,
        title: originalTask.title,
        isRecurring: 1,
        startDate: originalTask.startDate,
        endDate: originalTask.endDate,
        days: taskDays
      };
    } else if (originalTask) {
      return {
        id: originalTask.id,
        title: originalTask.title,
        user: originalTask.user,
        isRecurring: 0,
        date: originalTask.startDate,
        time: originalTask.time,
      };
    }

    return null;
  }

  getUserTasks(user: number) {
    return this.collection.queryAll({ user });
  }

  update(id: SearchCondition<Task>, data: Partial<Task>) {
    return this.collection.update(id, data);
  }

  async delete(id: number) {
    /** Deleting particular task by given id */
    await this.collection.delete(id);
    /** Looking for task linked to deleted task with originalId field */
    const linkedTasks = await this.collection.queryAll({ originalId: id });
    const tasksCount = linkedTasks.length;
    if (tasksCount) {
      const firstTaskId = linkedTasks[0].id;
      await this.collection.update(firstTaskId, { originalId: undefined });
      if (tasksCount > 1) {
        await this.collection.update({ originalId: id }, { originalId: firstTaskId });
      }
    }
  }

  deleteByOriginaId(originalId: number) {
    return this.collection.delete({ originalId });
  }
}

export const taskService = new TaskService(taskCollection);
