import React, { useReducer, useEffect } from "react";

import { validate } from "../../util/validators";

import "./Input.css";

// always takes into these two parameters, and returns a new state
const inputReducer = (state, action) => {
  switch (action.type) {
    case "CHANGE":
      return {
        // copies the current state
        // and overwrite some properties
        ...state,
        value: action.val, // it's up to me how to name the properties of action
        isValid: validate(action.val, action.validators),
      };
    case "TOUCH":
      return {
        ...state,
        isTouched: true,
      };
    default:
      return state;
  }
};

const Input = (props) => {
  // useReducer() is convenient when you have multiple states need to be set
  //    (and the states might affect one another)
  // dispatch function updates inputState
  // 1st argument: a reducer function,
  //    which receives an action that we can dispatch && receives the current state
  //    and then we update the current state based on the action, then returns the new state
  //  then useReducer() will take the new state and give it back to us and re-render everything
  // 2nd argument is the initial state (just like useEffect)
  const [inputState, dispatch] = useReducer(inputReducer, {
    value: props.initialValue || "",
    isTouched: false,
    isValid: props.initialValid || false,
  });

  const { id, onInput } = props;
  const { value, isValid } = inputState;

  useEffect(() => {
    onInput(id, value, isValid);
  }, [id, value, isValid, onInput]);

  const changeHandler = (event) => {
    // pass in the action object
    // event.target: is the input element on which this event was triggered
    //  and value is the value that the user entered
    dispatch({
      type: "CHANGE",
      val: event.target.value,
      validators: props.validators,
    });
  };

  const touchHandler = () => {
    dispatch({
      type: "TOUCH",
    });
  };

  const element =
    props.element === "input" ? (
      // onBlur is triggered when the user loses focus,
      //    i.e., the user clicks on it and then clicks away
      <input
        id={props.id}
        type={props.type}
        placeholder={props.placeholder}
        onChange={changeHandler}
        onBlur={touchHandler}
        value={inputState.value}
      />
    ) : (
      // two-way binding: changes get reflected by useReducer,
      //    and useReducer's dispatch function will also update the value if needed
      <textarea
        id={props.id}
        rows={props.rows || 3}
        onChange={changeHandler}
        onBlur={touchHandler}
        value={inputState.value}
      />
    );

  return (
    <div
      className={`form-control ${
        !inputState.isValid && inputState.isTouched && "form-control--invalid"
      }`}
    >
      <label htmlFor={props.id}>{props.label}</label>
      {element}
      {!inputState.isValid && inputState.isTouched && <p>{props.errorText}</p>}
    </div>
  );
};

export default Input;
