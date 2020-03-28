import React, {
  useState,
  useContext,
  useEffect,
  useLayoutEffect,
  Fragment
} from "react";
import {
  Row,
  Layout,
  Menu,
  Dropdown,
  message,
  Button,
  Drawer,
  Card
} from "antd";
import {
  LogoutOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined
} from "@ant-design/icons";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { QUOTES } from "../../context/types";

import Login from "../auth/Login";
import PrivateRoute from "../routing/PrivateRoute";
import AppContent from "../AppContent";
import AppSider from "../AppSider";
import WeeklyReview from "../WeeklyReview";
import MonthlyReview from "../MonthlyReview";
import DailyHistory from "../DailyHistory";
import WeeklyWorkload from "../WeeklyWorkload";
import "../Style.css";
import "antd/dist/antd.css";
import AuthContext from "../../context/auth/authContext";
import MyContext from "../../context/table/myContext";
import DailyContext from "../../context/daily/dailyContext";
import LangContext from "../../context/lang/langContext";
import axios from "axios";
import { SET_LANG } from "../../context/types";
import Register from "../auth/Register";

const Home = () => {
  const authContext = useContext(AuthContext);
  const myContext = useContext(MyContext);
  const dailyContext = useContext(DailyContext);
  const langContext = useContext(LangContext);

  const { logout, user, loadUser } = authContext;

  const { clearLogout, quotes, dispatch, isDataEdited } = myContext;

  const { clearDailyLogout } = dailyContext;

  const { switchLang, lang, currentLangData } = langContext;
  const {
    home: { _myAccount, _logOut }
  } = currentLangData
    ? currentLangData
    : {
        home: {
          _myAccount: "My Account",
          _logOut: "Log out"
        }
      };

  useLayoutEffect(() => {
    const selectedLang = window.localStorage.getItem("appUILang");

    if (selectedLang) {
      dispatch({ type: SET_LANG, payload: selectedLang });
    }
    // eslint-disable-next-line
  }, [lang]);

  useEffect(() => {
    loadUser();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const randomQuote = async () => {
      try {
        const res = await axios.get("https://api.quotable.io/random");
        // console.log(res.data);
        dispatch({ type: QUOTES, payload: res.data.content });
      } catch (error) {
        console.log(error);
      }
    };
    randomQuote();
  }, [dispatch]);

  const onLogout = () => {
    logout();
    clearLogout();
    clearDailyLogout();
    message.info("LOGGED OUT");
    setVisible(false);
  };

  const [collapsed, setCollapsed] = useState(true);
  const [visible, setVisible] = useState(false);

  const { Header, Footer } = Layout;

  const toggle = () => {
    setCollapsed(!collapsed);
  };

  const onNameClick = () => {
    setVisible(true);
  };

  const langMenu = (
    <Menu>
      <Menu.Item
        key="1"
        onClick={() =>
          isDataEdited
            ? message.error("Please save your data or cancel changes first!")
            : switchLang("en-US")
        }
      >
        English
      </Menu.Item>
      <Menu.Item
        key="2"
        onClick={() =>
          isDataEdited
            ? message.error("Please save your data or cancel changes first!")
            : switchLang("ja")
        }
      >
        日本語
      </Menu.Item>
      <Menu.Item
        key="3"
        onClick={() =>
          isDataEdited
            ? message.error("Please save your data or cancel changes first!")
            : switchLang("vi")
        }
      >
        Tiếng Việt
      </Menu.Item>
      <Menu.Item
        key="4"
        onClick={() =>
          isDataEdited
            ? message.error("Please save your data or cancel changes first!")
            : switchLang("zh")
        }
      >
        中文
      </Menu.Item>
      <Menu.Item
        key="5"
        onClick={() =>
          isDataEdited
            ? message.error("Please save your data or cancel changes first!")
            : switchLang("ko")
        }
      >
        한국어
      </Menu.Item>
    </Menu>
  );

  const onClose = () => {
    setVisible(false);
  };

  return (
    <Router>
      <Switch>
        <Route exact path="/login" component={Login} />
        <Route exact path="/register" component={Register} />
        <Fragment>
          <Layout>
            <AppSider isCollapsed={collapsed} />
            <Layout>
              <Layout>
                <Header>
                  <Row type="flex" justify="space-between">
                    {React.createElement(
                      collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
                      {
                        className: "trigger",
                        onClick: toggle
                      }
                    )}
                    <div>
                      <Dropdown overlay={langMenu}>
                        <Button style={{ marginRight: "5px" }}>
                          {lang === "en-US"
                            ? "English"
                            : lang === "ja"
                            ? "日本語"
                            : lang === "vi"
                            ? "Tiếng Việt"
                            : lang === "zh"
                            ? "中文"
                            : lang === "ko"
                            ? "한국어"
                            : "Language"}
                        </Button>
                      </Dropdown>

                      <Button
                        style={{ marginRight: "65px" }}
                        onClick={onNameClick}
                      >
                        {user ? user.name : "Welcome!"}
                      </Button>
                      <Drawer
                        title={_myAccount}
                        placement="right"
                        closable={false}
                        onClose={onClose}
                        visible={visible}
                        width="280px"
                        bodyStyle={{
                          backgroundColor: "#faf9f8",
                          padding: "0 0"
                        }}
                        headerStyle={{ backgroundColor: "#faf9f8" }}
                      >
                        <Card
                          style={{
                            float: "left",
                            position: "absolute",
                            backgroundColor: "#fff",
                            borderWidth: "2px",
                            borderTopColor: "#e8e7e7",
                            borderBottomColor: "#e8e7e7",
                            width: "280px",
                            padding: "0 0",
                            textAlign: "center"
                          }}
                          bordered={true}
                        >
                          <p style={{ fontSize: "20px", fontWeight: "bold" }}>
                            {user ? user.name : "Welcome!"}
                          </p>
                          <p style={{ fontSize: "16px" }}>
                            {user ? user.email : "Your email here"}
                          </p>
                          <Button
                            size="large"
                            onClick={onLogout}
                            style={{
                              width: "100%",
                              background: "rgb(2, 32, 60)",
                              color: "#fff"
                            }}
                          >
                            {_logOut}
                            <LogoutOutlined />
                          </Button>
                        </Card>
                      </Drawer>
                    </div>
                  </Row>
                </Header>
              </Layout>
              <PrivateRoute key="/" path="/" exact component={AppContent} />
              <PrivateRoute
                key="/weeklyreview"
                path="/weeklyreview"
                exact
                component={WeeklyReview}
              />
              <PrivateRoute
                key="/monthlyreview"
                path="/monthlyreview"
                exact
                component={MonthlyReview}
              />
              <PrivateRoute
                key="/dailyhistory"
                path="/dailyhistory"
                exact
                component={DailyHistory}
              />
              <PrivateRoute
                key="/weeklyworkload"
                path="/weeklyworkload"
                exact
                component={WeeklyWorkload}
              />
              {/* <PrivateRoute path="*">
                <Redirect to="/" />
              </PrivateRoute> */}
              <Footer>
                <h3 style={{ margin: "20px 20px" }}>
                  {quotes === null ? null : `"${quotes}"`}
                </h3>
                <h3 style={{ margin: "20px 20px" }}>
                  Copyright © 2002-2020 TechnoStar Co., Ltd.
                </h3>
              </Footer>
            </Layout>
          </Layout>
        </Fragment>
      </Switch>
    </Router>
  );
};

export default Home;
