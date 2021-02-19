import React from "react";

import "./variables.css";
import "./colorscheme.css";

import { Route, Switch, useHistory } from "react-router-dom";
import { ProtectedRoute } from "./protected.route";

import IncidentDetailsView from "./views/incident/IncidentDetailView";
import IncidentView from "./views/incident/IncidentView";
import LoginView from "./views/login/LoginView";
import NotificationProfileView from "./views/notificationprofile/NotificationProfileView";
import SettingsView from "./views/settings/SettingsView";
import TimeslotView from "./views/timeslot/TimeslotView";

import api from "./api";
import auth from "./auth";

import { ThemeProvider } from "@material-ui/core/styles";
import { MUI_THEME } from "./colorscheme";
import { AppContext } from "./contexts";

import { AlertSnackbarProvider, useAlerts } from "./components/alertsnackbar";
import Header from "./components/header/Header";
import Footer from "./components/Footer";

// eslint-disable-next-line
const asView = (Component: any) => {
  // eslint-disable-next-line
  return (props: any) => (
    <>
      <header>
        <Header />
      </header>
      <main className="site-content">
        <Component {...props} />
      </main>
      <footer>
        <Footer />
      </footer>
    </>
  );
};

// eslint-disable-next-line
const ApiInterceptor = (props: any) => {
  const history = useHistory();
  const displayAlert = useAlerts();
  api.registerInterceptors(
    () => {
      displayAlert("Unauthorized, logging out", "error");
      auth.logout();
      history.push("/login");
    },
    (response, error) => {
      displayAlert(`Api Server Error: ${error}`, "error");
    },
  );

  return <>{props.children}</>;
};

const App: React.SFC = () => {
  // const { incidentSnackbar, displayAlertSnackbar } = useAlertSnackbar();
  return (
    <div className="site">
      <ThemeProvider theme={MUI_THEME}>
        <AlertSnackbarProvider>
          <ApiInterceptor>
            <Switch>
              <ProtectedRoute exact path="/" component={asView(IncidentView)} />
              <ProtectedRoute path="/incidents/:pk" component={asView(IncidentDetailsView)} />
              <ProtectedRoute exact path="/incidents" component={asView(IncidentView)} />
              <ProtectedRoute path="/notificationprofiles" component={asView(NotificationProfileView)} />
              <ProtectedRoute path="/timeslots" component={asView(TimeslotView)} />
              <ProtectedRoute path="/settings" component={asView(SettingsView)} />
              <Route path="/login" component={LoginView} />
              <Route
                path="*"
                component={() => (
                  <div id="not-found">
                    <h1>404 not found</h1>
                  </div>
                )}
              />
            </Switch>
          </ApiInterceptor>
        </AlertSnackbarProvider>
      </ThemeProvider>
    </div>
  );
};

export default App;
