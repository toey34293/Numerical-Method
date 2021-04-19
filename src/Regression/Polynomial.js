import React, { Component } from "react";
import "antd/dist/antd.css";
import { Card, Input, Button, Table } from "antd";
import Desmos from "desmos";
import { addStyles, EditableMathField } from "react-mathquill";
import regression from "regression";
const AlgebraLatex = require("algebra-latex");
const math = require("mathjs");

addStyles();

var dataInTable = [];
var columns2 = [
  {
    title: "Ans",
    dataIndex: "Ans",
    key: "Ans",
  },
];

var columns1 = [
  {
    title: "No.",
    dataIndex: "no",
    key: "no",
  },
  {
    title: "X",
    dataIndex: "x",
    key: "x",
  },
  {
    title: "Y",
    dataIndex: "y",
    key: "y",
  },
];
var x = [],
  y = [],
  tableTag = [],
  answer;

export default class Test extends Component {
  constructor(props) {
    super(props);
    this.bi = this.bi.bind(this);
    this.Ex = this.Ex.bind(this);
    this.state = {
      nPoints: null,
      ans: [],
      showTableInput: false,
      showTableInpu2: false,
    };
    this.elt = {};
    this.calculator = {};
  }
  //API
  async Ex() {
    // const url = "https://api.randomuser.me/";
    const url = "http://localhost:8000/Polynomial";
    // const url = "http://192.168.102.128:8000/Newton";
    // const url = "http://127.0.0.1/Json/item.json";
    const response = await fetch(url);
    console.log(response);
    const data = await response.json();
    console.log(data);
    this.setState({
      nPoints: data.Polynomial.nPoints,
      X: data.Polynomial.X,
    });
    console.log("nPoints", this.state.nPoints);
    this.createTableInput(parseInt(this.state.nPoints));

    for (var i = 0; i < this.state.nPoints; i++) {
      document.getElementById("x" + (i + 1)).value = data.Polynomial.x[i];
      document.getElementById("y" + (i + 1)).value = data.Polynomial.y[i];
    }

    this.forceUpdate();
  }

  componentDidMount() {
    //ทำอัตโนมัติหลังจาก render เสร็จ
  }
  componentDidUpdate() {}

  initialValue() {
    x = [];
    y = [];
    for (var i = 0; i < this.state.nPoints; i++) {
      x[i] = parseFloat(document.getElementById("x" + (i + 1)).value);
      y[i] = parseFloat(document.getElementById("y" + (i + 1)).value);
    }
    console.log("X", this.state.X);
    console.log("x", x);
    console.log("y", y);
    console.log("initialValue");
  }

  cal(nPoints) {
    console.log("x", x);
    console.log("y", y);
    console.log("nPoints", nPoints);
    if (x.length !== 0 && y.length !== 0) {
      var arr = [];
      var xi = this.state.X;
      for (let i = 0; i < nPoints; i++) {
        arr.push([x[i], y[i]]);
      }
      console.log(arr);
      console.log(
        regression
          .polynomial(arr, {
            precision: 6,
          })
          .predict(xi)[1]
      );
    }
    answer = regression
      .linear(arr, {
        precision: 6,
      })
      .predict(xi)[1];
  }

  bi() {
    dataInTable = [];
    this.initialValue();
    this.cal(this.state.nPoints);
    console.log("answer", answer);
    dataInTable.push({
      Ans: answer,
    });
    this.forceUpdate();
    console.log("end");
  }

  createTableInput(n) {
    x = [];
    y = [];
    tableTag = [];
    for (var i = 1; i <= n; i++) {
      x.push(
        <Input
          style={{
            width: "100%",
            height: "50%",
            backgroundColor: "black",
            marginInlineEnd: "5%",
            marginBlockEnd: "5%",
            color: "white",
            fontSize: "18px",
            fontWeight: "bold",
          }}
          id={"x" + i}
          key={"x" + i}
          placeholder={"x" + i}
        />
      );
      y.push(
        <Input
          style={{
            width: "100%",
            height: "50%",
            backgroundColor: "black",
            marginInlineEnd: "5%",
            marginBlockEnd: "5%",
            color: "white",
            fontSize: "18px",
            fontWeight: "bold",
          }}
          id={"y" + i}
          key={"y" + i}
          placeholder={"y" + i}
        />
      );
      tableTag.push({
        no: i,
        x: x[i - 1],
        y: y[i - 1],
      });
    }

    this.setState({
      showTableInput: true,
    });
    console.log(x, y, tableTag);
  }

  render() {
    return (
      <div>
        <h1>Polynomial Regression</h1>
        <div className="row">
          <div className="col">
            <div>
              <p>Number of points (n)</p>
              <Input
                onChange={async (e) => {
                  await this.setState({ nPoints: e.target.value });
                  this.createTableInput(parseInt(this.state.nPoints));
                  this.forceUpdate();
                }}
                value={this.state.nPoints}
                name="nPoints"
                placeholder="Number of points (n)"
              />
              <p>X</p>
              <Input
                onChange={(e) => {
                  this.setState({ X: e.target.value });
                  this.forceUpdate();
                }}
                value={this.state.X}
                name="X"
                placeholder="X"
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
            {this.state.showTableInput && (
              <div>
                <Table
                  columns={columns1}
                  dataSource={tableTag}
                  pagination={false}
                  bordered={true}
                  bodyStyle={{
                    fontWeight: "bold",
                    fontSize: "18px",
                    color: "white",
                    overflowY: "scroll",
                    minWidth: 120,
                    maxHeight: 300,
                  }}
                ></Table>
              </div>
            )}
          </div>
        </div>

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
            columns={columns2}
            dataSource={dataInTable}
            pagination={false}
            bordered={true}
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
