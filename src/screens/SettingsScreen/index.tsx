import { BsShieldLockFill } from "solid-icons/bs";
import { FaSolidCircleUser } from "solid-icons/fa";
import { IoKey, IoLanguage, IoPencil, IoTrash } from "solid-icons/io";
import { VsColorMode } from "solid-icons/vs";

import { List, ListItem, ScreenHeader, ThemeToggleButton, VerticalScroll } from "@app/components";
import { getLocale, langData, t } from "@app/i18n";
import { Link, user } from "@app/stores";

import { ItemIcon } from "./components";

export function SettingsScreen() {
  return (
    <main>
      <ScreenHeader title={t("SettingsScreen.title")} />
      <VerticalScroll hasHeader hasBottomNavigation>
        <div class="flex py-3 flex-col items-center gap-3">
          <img src={user.currentUser().data!.avatar} class="max-w-full rounded-full" />
          <Link href="/settings/change-avatar" class="btn btn-transparent btn-sm flex gap-1">
            <IoPencil />
            <span>{t("SettingsScreen.changeAvatar")}</span>
          </Link>
        </div>
        <div class="px-3">
          <List itemsGap="sm">
            <ListItem
              size="sm"
              icon={<ItemIcon icon={FaSolidCircleUser} />}
              title={t("SettingsScreen.personalInfo")}
              description={(
                <>
                  {user.currentUser().data!.firstName} {user.currentUser().data!.lastName}
                </>
              )}
            />
            <ListItem
              size="sm"
              icon={<ItemIcon icon={IoLanguage} />}
              title={t("SettingsScreen.language")}
              rightElement={(
                <span class="inline-flex text-sm gap-2 items-center text-secondary-400 dark:text-secondary-300 font-normal">
                  <span>{langData[getLocale()].name}</span>
                  <img class="w-4 h-4" src={langData[getLocale()].flag} />
                </span>
              )}
            />
            <ListItem
              size="sm"
              icon={<ItemIcon icon={VsColorMode} />}
              title={t("SettingsScreen.colorScheme")}
              rightElement={<ThemeToggleButton />}
            />
            <ListItem
              size="sm"
              icon={<ItemIcon icon={IoKey} />}
              title={t("SettingsScreen.password")}
            />
            <ListItem
              size="sm"
              icon={<ItemIcon icon={BsShieldLockFill} />}
              title={t("SettingsScreen.pinCode")}
            />
            <ListItem
              size="sm"
              icon={<ItemIcon icon={IoTrash} />}
              title={t("SettingsScreen.wipeData")}
            />
          </List>
        </div>
      </VerticalScroll>
    </main>
  );
}
