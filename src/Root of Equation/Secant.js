import React, { Component } from "react";
import "antd/dist/antd.css";
import { Card, Input, Button, Table } from "antd";
import Desmos from "desmos";
import { addStyles, EditableMathField } from "react-mathquill";
import { compile, derivative } from "mathjs";
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
    title: "Y",
    dataIndex: "y",
    key: "y",
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
    this.state = { ans: [], Funtion: "", X0: null, X1: null };
    this.elt = {};
    this.calculator = {};
  }

  //API
  async Ex() {
    // const url = "https://api.randomuser.me/";
    const url = "http://localhost:8000/Secant";
    // const url = "http://127.0.0.1/Json/item.json";
    const response = await fetch(url);
    console.log(response);
    const data = await response.json();
    console.log(data);
    this.setState({
      Funtion: data.Secant.Funtion,
      X0: data.Secant.X0,
      X1: data.Secant.X1,
    });
    console.log(this.state.X0);
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
    this.calculator.setExpression({ id: "graph1", latex: this.state.Funtion });
    // this.calculator.setExpression({
    //   id: "line1",
    //   latex: "x=" + this.state.X0,
    //   lineStyle: Desmos.Styles.DASHED,
    // });

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

  error(xnew, xold) {
    return Math.abs((xnew - xold) / xnew);
  }
  func(Funtion, x) {
    console.log(this);
    const algebraObj = new AlgebraLatex().parseLatex(Funtion).toMath();
    console.log(math.evaluate(algebraObj, { x: x }));
    return math.evaluate(algebraObj, { x: x });
  }

  bi() {
    var x0 = Number(this.state.X0);
    var x1 = Number(this.state.X1);
    var func = this.func;
    var error = this.error;
    var x = [],
      y = 0,
      epsilon = parseFloat(0.0);
    var n = 1,
      i = 1;
    var data = [];
    data["y"] = [];
    data["error"] = [];
    x.push(x0);
    x.push(x1);
    data["y"][0] = x0;
    data["error"][0] = "---";

    do {
      y =
        x[i] -
        (func(this.state.Funtion, x[i]) * (x[i] - x[i - 1])) /
          (func(this.state.Funtion, x[i]) - func(this.state.Funtion, x[i - 1]));
      x.push(y);
      epsilon = error(y, x[i]);
      data["y"][n] = y.toFixed(8);
      data["error"][n] = Math.abs(epsilon).toFixed(8);
      n++;
      i++;
      if (n >= 1000) {
        break;
      }
    } while (Math.abs(epsilon) > 0.000001);
    this.createTable(data["y"], data["error"]);
    this.setState({
      showOutputCard: true,
      showGraph: true,
    });
  }

  createTable(y, error) {
    dataInTable = [];
    for (var i = 0; i < y.length; i++) {
      dataInTable.push({
        iteration: i + 1,
        y: y[i],
        error: error[i],
      });
    }
  }

  render() {
    return (
      <div>
        <h1>Secant</h1>
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
              <p>X0</p>
              <Input
                onChange={(e) => {
                  this.setState({ X0: e.target.value });
                  this.forceUpdate();
                }}
                value={this.state.X0}
                name="X0"
                placeholder="X0"
              />
              <p>X1</p>
              <Input
                onChange={(e) => {
                  this.setState({ X1: e.target.value });
                  this.forceUpdate();
                }}
                value={this.state.X1}
                name="X1"
                placeholder="X1"
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
