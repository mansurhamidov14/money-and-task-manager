import { Navigate, Route, RouteSectionProps, HashRouter as Router } from "@solidjs/router";
import { Show, onMount } from "solid-js";
import { BottomNavigation, Layout, Loading, ToastList } from "@app/components";
import { HistoryScreen, HomeScreen, LoginPage, SignUpPage } from "@app/screens";
import { userService, transactionService } from "@app/services";
import { transactionsStore, user, themeStore } from "@app/stores";

import "./App.css";
import { RerenderOnLangChange } from "./i18n/components";

function App(props: RouteSectionProps) {
  return (
    <Layout>
      <RerenderOnLangChange>
        {props.children}
      </RerenderOnLangChange>
      <Show when={user.currentUser().isAuthorized}>
        <BottomNavigation />
      </Show>
    </Layout>
  );
}

export default function() {
  const { theme } = themeStore;
  onMount(async () => {
    const authorizedUser = await userService.getAuthorizedUser();
    if (authorizedUser) {
      const userTransactions = await transactionService.getUserTransactions(authorizedUser.id);
      setTimeout(() => {
        transactionsStore.setTransactions(userTransactions);
      }, 500);
      user.setCurrentUser({
        isAuthorized: true,
        isLoading: false,
        data: authorizedUser
      });
    } else {
      user.setCurrentUser({
        isAuthorized: false,
        isLoading: false
      });
    }
  });

  return (
    <div class={`${theme()} app-container`}>
      <Show
        when={!user.currentUser().isLoading} fallback={(
          <div class="h-[100svh] flex items-center">
            <Loading />
          </div>
        )}
      >
        <Router root={App}>
          <Route path="/" component={() => <Navigate href="/home" />} />
          <Route path="/auth">
            <Route path="/" component={LoginPage} />
            <Route path="/signup" component={SignUpPage} />
          </Route>
          <Route path="/home" component={HomeScreen} />
          <Route path="/history" component={HistoryScreen} />
        </Router>
      </Show>
      <ToastList />
    </div>
  );
}
