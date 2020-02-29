import React, { useReducer } from "react";
import axios from "axios";
import MyContext from "./myContext";
import MyReducer from "./myReducer";
import {
  GET_PROJECT,
  GET_SUB,
  GET_DATA_FROM_DATE,
  SAVE_DATA,
  SET_LOADING,
  CLEAR_LOGOUT
} from "../types";
import moment from "moment";

const MyState = props => {
  const initialState = {
    selectedDate: moment(),
    projects: [{ pjid: "--Choose--", pjname_en: "--Choose--" }],
    subs: [{ subid: "--Choose--", subname_en: "--Choose--" }],
    loading: false,
    dataSource: [],
    oldCount: 0,
    rowCount: 0
  };

  const [state, dispatch] = useReducer(MyReducer, initialState);

  const getProject = async () => {
    setLoading();
    const res = await axios.get("api/projects");
    dispatch({ type: GET_PROJECT, payload: res.data.data });
  };

  const getSub = async () => {
    setLoading();
    const res = await axios.get("api/subs");
    dispatch({ type: GET_SUB, payload: res.data.data });
  };

  const getDataFromDate = async (name, selectedDate, projects, subs) => {
    if (selectedDate !== null) {
      setLoading();

      const workdate = selectedDate
        .format("YYYY-MM-DD")
        .split("-")
        .join("");

      // const name = user && user.name;

      const res = await axios.get(`api/personal`, {
        params: {
          name,
          workdate
        }
      });
      const newData = res.data.data.map((item, index) => {
        return {
          key: index,
          selectedProjectId: item.pjid,
          selectedProjectName: projects.find(
            element => element.pjid === item.pjid
          ).pjname_en,
          selectedSubId: item.subid,
          selectedSubName: subs.find(element => element.subid === item.subid)
            .subname_en,
          startTime: moment(
            `"${item.starthour}:${item.startmin}:00"`,
            "HH:mm:ss"
          ),
          endTime: moment(`"${item.endhour}:${item.endmin}:00"`, "HH:mm:ss"),
          workTime: `${
            parseInt(item.worktime / 60) < 10
              ? "0" + parseInt(item.worktime / 60).toString()
              : parseInt(item.worktime / 60)
          }:${
            item.worktime % 60 < 10
              ? "0" + (item.worktime % 60).toString()
              : item.worktime % 60
          }`,
          status: null,
          comment: item.comment
        };
      });
      // console.log(newData);
      dispatch({
        type: GET_DATA_FROM_DATE,
        payload: newData,
        dataLength: newData.length
      });
    }
  };

  const onSave = async (oldCount, dataSource, name, selectedDate) => {
    if (selectedDate !== null) {
      setLoading();

      const workdate = selectedDate
        .format("YYYY-MM-DD")
        .split("-")
        .join("");

      if (oldCount === 0) {
        for (let i = 0; i < dataSource.length; i++) {
          const {
            selectedProjectId,
            selectedProjectName,
            selectedSubId,
            selectedSubName
          } = dataSource[i];

          // INSERT DATA
          const res = await axios.post(`api/projects/add`, {
            params: {
              name,
              workdate,
              count: i + 1,
              pjid: selectedProjectId,
              pjname: selectedProjectName,
              subid: selectedSubId,
              subname: selectedSubName
            }
          });
          console.log(res);
        }
      } else if (oldCount > 0) {
        if (dataSource.length === oldCount) {
          for (let i = 0; i < dataSource.length; i++) {
            const {
              selectedProjectId,
              selectedProjectName,
              selectedSubId,
              selectedSubName
            } = dataSource[i];

            // UPDATE DATA
            const res = await axios.put(`/api/projects/update`, {
              params: {
                name,
                workdate,
                count: i + 1,
                pjid: selectedProjectId,
                pjname: selectedProjectName,
                subid: selectedSubId,
                subname: selectedSubName
              }
            });
          }
        } else if (dataSource.length !== oldCount) {
          for (let i = 0; i < oldCount; i++) {
            // DELETE DATA
            const res = await axios.delete(`/api/projects/delete`, {
              params: {
                name,
                workdate,
                count: i + 1
              }
            });
            console.log(res);
          }

          for (let i = 0; i < dataSource.length; i++) {
            const {
              selectedProjectId,
              selectedProjectName,
              selectedSubId,
              selectedSubName
            } = dataSource[i];
            console.log(dataSource[i]);

            // INSERT DATA
            const res = await axios.post(`api/projects/add`, {
              params: {
                name,
                workdate,
                count: i + 1,
                pjid: selectedProjectId,
                pjname: selectedProjectName,
                subid: selectedSubId,
                subname: selectedSubName
              }
            });
            console.log(res);
          }
        }
      }
      dispatch({
        type: SAVE_DATA,
        dataLength: dataSource.length
      });
      console.log(dataSource);
    }
  };

  // const insertData = async (
  //   name,
  //   selectedDate,
  //   count,
  //   selectedProjectId,
  //   selectedProjectName,
  //   selectedSubId,
  //   selectedSubName
  // ) => {
  //   if (selectedDate !== null) {
  //     setLoading();

  //     const workdate = selectedDate
  //       .format("YYYY-MM-DD")
  //       .split("-")
  //       .join("");

  //     // const name = user && user.name;

  //     const res = await axios.post(`api/projects/add`, {
  //       params: {
  //         name,
  //         workdate,
  //         count,
  //         pjid: selectedProjectId,
  //         pjname: selectedProjectName,
  //         subid: selectedSubId,
  //         subname: selectedSubName
  //       }
  //     });
  //     console.log(res);

  //     // console.log(newData);
  //     dispatch({ type: INSERT_DATA });
  //   }
  // };

  // const updateData = async (
  //   name,
  //   selectedDate,
  //   count,
  //   selectedProjectId,
  //   selectedProjectName,
  //   selectedSubId,
  //   selectedSubName
  // ) => {
  //   if (selectedDate !== null) {
  //     setLoading();

  //     const workdate = selectedDate
  //       .format("YYYY-MM-DD")
  //       .split("-")
  //       .join("");

  //     // const name = user && user.name;

  //     const res = await axios.put(`/api/projects/update`, {
  //       params: {
  //         name,
  //         workdate,
  //         count,
  //         pjid: selectedProjectId,
  //         pjname: selectedProjectName,
  //         subid: selectedSubId,
  //         subname: selectedSubName
  //       }
  //     });
  //     console.log(res);

  //     // console.log(newData);
  //     dispatch({ type: UPDATE_DATA });
  //   }
  // };

  // const deleteData = async (name, selectedDate, count) => {
  //   if (selectedDate !== null) {
  //     setLoading();

  //     const workdate = selectedDate
  //       .format("YYYY-MM-DD")
  //       .split("-")
  //       .join("");

  //     // const name = user && user.name;

  //     const res = await axios.delete(`/api/projects/delete`, {
  //       params: {
  //         name,
  //         workdate,
  //         count
  //       }
  //     });
  //     console.log(res);

  //     // console.log(newData);
  //     dispatch({ type: DELETE_DATA });
  //   }
  // };

  const setLoading = () => dispatch({ type: SET_LOADING });

  const clearLogout = () => {
    dispatch({ type: CLEAR_LOGOUT });
  };

  return (
    <MyContext.Provider
      value={{
        selectedDate: state.selectedDate,
        projects: state.projects,
        subs: state.subs,
        dataSource: state.dataSource,
        oldCount: state.oldCount,
        rowCount: state.rowCount,
        loading: state.loading,
        dispatch,
        getProject,
        getSub,
        getDataFromDate,
        clearLogout,
        onSave
      }}
    >
      {props.children}
    </MyContext.Provider>
  );
};

export default MyState;
