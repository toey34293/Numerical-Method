import React, { Component } from "react";
import "antd/dist/antd.css";
import { Card, Input, Button, Table } from "antd";
import Desmos from "desmos";
import { addStyles, EditableMathField } from "react-mathquill";
const AlgebraLatex = require("algebra-latex");
const math = require("mathjs");

addStyles();

var dataInTable = [];
const columns = [
  {
    title: "Iteration",
    dataIndex: "iteration",
    key: "iteration",
  },
  {
    title: "XL",
    dataIndex: "xl",
    key: "xl",
  },
  {
    title: "XR",
    dataIndex: "xr",
    key: "xr",
  },
  {
    title: "X",
    dataIndex: "x",
    key: "x",
  },
  {
    title: "Error",
    key: "error",
    dataIndex: "error",
  },
];

export default class Test extends Component {
  constructor(props) {
    super(props);
    this.bi = this.bi.bind(this);
    this.Ex = this.Ex.bind(this);
    this.fn = this.fn.bind(this);
    this.state = { ans: [], Funtion: "", XL: null, XR: null };
    this.elt = {};
    this.calculator = {};
  }
  //API
  async Ex() {
    // const url = "https://api.randomuser.me/";
    const url = "http://localhost:8000/Bisection";
    // const url = "http://127.0.0.1/Json/item.json";
    const response = await fetch(url);
    console.log(response);
    const data = await response.json();
    console.log(data);
    this.setState({
      Funtion: data.Bisection.Funtion,
      XL: data.Bisection.XL,
      XR: data.Bisection.XR,
    });
  }

  componentDidMount() {
    //ทำอัตโนมัติหลังจาก render เสร็จ
    console.log(this.state.Funtion);
    console.log(this);
    this.elt = document.getElementById("calculator");
    this.calculator = Desmos.GraphingCalculator(this.elt, {
      expressions: false,
      backgroundColor: "#F4F6F7",
      textColor: "#C70039",
    });
    this.calculator.setExpression({ id: "graph1", latex: this.state.Funtion });
    this.calculator.setExpression({
      id: "line1",
      latex: "x=" + this.state.XL,
      lineStyle: Desmos.Styles.DASHED,
    });
    this.calculator.setExpression({
      id: "line2",
      latex: "x=" + this.state.XR,
      lineStyle: Desmos.Styles.DASHED,
    });
    // this.bi();
    document.getElementsByClassName(
      "dcg-graphpaper-branding"
    )[0].style.display = "none";
  }
  componentDidUpdate() {
    this.calculator.destroy();
    this.elt = document.getElementById("calculator");
    this.calculator = Desmos.GraphingCalculator(this.elt, {
      expressions: false,
      backgroundColor: "#F4F6F7",
      textColor: "#C70039",
    });
    this.calculator.setExpression({
      id: "line3",
      latex: this.state.XL + "<=x<=" + this.state.XR,
      lineStyle: Desmos.Styles.DASHED,
      color: this.calculator.colors.ORANGE,
    });
    this.calculator.setExpression({ id: "graph1", latex: this.state.Funtion });
    this.calculator.setExpression({
      id: "line1",
      latex: "x=" + this.state.XL,
      lineStyle: Desmos.Styles.DASHED,
    });
    this.calculator.setExpression({
      id: "line2",
      latex: "x=" + this.state.XR,
      lineStyle: Desmos.Styles.DASHED,
    });
    console.log(this.calculator);
    document.getElementsByClassName(
      "dcg-graphpaper-branding"
    )[0].style.display = "none";
  }

  fn(x) {
    const algebraObj = new AlgebraLatex()
      .parseLatex(this.state.Funtion)
      .toMath();
    console.log(math.evaluate(algebraObj, { x: x }));
    return math.evaluate(algebraObj, { x: x });
    // console.log(math.evaluate(this.state.Funtion, { x: x }));
    // return math.evaluate(this.state.Funtion, { x: x });
  }

  bi() {
    var fn = this.fn;
    console.log(fn);
    var data = [];
    data["xl"] = [];
    data["xr"] = [];
    data["x"] = [];
    data["error"] = [];

    var xl = Number(this.state.XL);
    var xr = Number(this.state.XR);
    var xmn,
      xmo,
      eps = 0.00001,
      time = 0;
    var ans = [];

    xmn = (xl + xr) / 2;
    if (fn(xmn) * fn(xr) > 0) {
      xr = xmn;
    } else if (fn(xmn) * fn(xr) < 0) {
      xl = xmn;
    } else {
      console.log("Iteration No. = " + time);
      console.log("Root of equation is " + xmn.toFixed(6));
      ans.push(xmn.toFixed(6));
      return;
    }
    data["xl"][0] = xl;
    data["xr"][0] = xr;
    data["x"][0] = xmn.toFixed(6);
    data["error"][0] = Math.abs(err).toFixed(6);
    while (true) {
      if (time >= 1000) {
        break;
      }
      time++;
      xmo = xmn;
      xmn = (xl + xr) / 2;
      if (fn(xmn) * fn(xr) > 0) {
        xr = xmn;
      } else if (fn(xmn) * fn(xr) < 0) {
        xl = xmn;
      } else {
        // console.log("Root of equation is " + xmn);
        break;
      }
      var err = Math.abs((xmn - xmo) / xmn);
      if (err <= eps) {
        break;
      }
      data["xl"][time] = xl;
      data["xr"][time] = xr;
      data["x"][time] = xmn.toFixed(6);
      data["error"][time] = Math.abs(err).toFixed(6);

      console.log("Iteration No. = " + time);
      console.log("Root of equation is " + xmn.toFixed(6));
      ans.push(xmn.toFixed(6));
    }
    console.log("Iteration No. = " + time);
    console.log("Root of equation is " + xmn.toFixed(6));
    ans.push(xmn.toFixed(6));

    data["xl"][time] = xl;
    data["xr"][time] = xr;
    data["x"][time] = xmn.toFixed(6);
    data["error"][time] = Math.abs(err).toFixed(6);

    this.createTable(data["xl"], data["xr"], data["x"], data["error"]);
    this.setState({ ans: ans });
    // console.log(fn(2));
  }

  createTable(xl, xr, x, error) {
    dataInTable = [];
    for (var i = 0; i < xl.length; i++) {
      dataInTable.push({
        iteration: i + 1,
        xl: xl[i],
        xr: xr[i],
        x: x[i],
        error: error[i],
      });
    }
  }

  render() {
    return (
      <div>
        <h1>Bisection</h1>
        <div className="row">
          <div className="col">
            <div>
              <p>Funtion</p>
              <Input
                onChange={(e) => {
                  this.setState({ Funtion: e.target.value });
                  this.forceUpdate();
                }}
                value={this.state.Funtion}
                name="Funtion"
                placeholder="Funtion"
              />
              <br></br>
              <br></br>
              <EditableMathField
                style={{ display: "block" }}
                latex={this.state.Funtion}
                onChange={(mathField) => {
                  this.setState({ Funtion: mathField.latex() });
                }}
              />
              <p>XL</p>
              <Input
                onChange={(e) => {
                  this.setState({ XL: e.target.value });
                  this.forceUpdate();
                }}
                value={this.state.XL}
                name="XL"
                placeholder="XL"
              />
              <p>XR</p>
              <Input
                onChange={(e) => {
                  this.setState({ XR: e.target.value });
                  this.forceUpdate();
                }}
                value={this.state.XR}
                name="XR"
                placeholder="XR"
              />
              <br></br>
              <br></br>
              <Button onClick={this.bi} type="primary">
                Submit
              </Button>
              <Button
                style={{
                  marginLeft: "73%",
                  backgroundColor: "#76D7C4",
                  borderColor: "#76D7C4",
                }}
                onClick={this.Ex}
                type="primary"
              >
                Example
              </Button>
            </div>
            <br></br>
          </div>
          <div className="col">
            <div
              id="calculator"
              style={{
                width: "600px",
                height: "400px",
              }}
            ></div>
          </div>
        </div>
        <br></br>
        <br></br>
        {/* {this.state.ans.map((data, i) => {
          return (
            <p>
              Iteration No.{i + 1} Root of equation is {data}
            </p>
          );
        })} */}
        <Card
          title={"Output"}
          bordered={true}
          style={{
            width: "100%",
            background: "#2196f3",
            color: "#FFFFFFFF",
          }}
          id="outputCard"
        >
          <Table
            pagination={{ defaultPageSize: 5 }}
            columns={columns}
            dataSource={dataInTable}
            bodyStyle={{
              fontWeight: "bold",
              fontSize: "18px",
              color: "black",
            }}
          ></Table>
        </Card>
      </div>
    );
  }
}
