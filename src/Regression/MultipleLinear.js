import React, { Component } from "react";
import "antd/dist/antd.css";
import { Card, Input, Button, Table } from "antd";
import Desmos from "desmos";
import { addStyles, EditableMathField } from "react-mathquill";
const { regression } = require("multiregress");
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
  answer,
  matrixX = [];

export default class Test extends Component {
  constructor(props) {
    super(props);
    this.bi = this.bi.bind(this);
    this.Ex = this.Ex.bind(this);
    this.state = {
      nPoints: null,
      X: null,
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
    const url = "http://192.168.102.128:8000/MultipleLinear";
    // const url = "http://192.168.102.128:8000/Newton";
    // const url = "http://127.0.0.1/Json/item.json";
    const response = await fetch(url);
    console.log(response);
    const data = await response.json();
    console.log("data", data);
    this.setState({
      nPoints: data.MultipleLinear.nPoints,
      X: data.MultipleLinear.X,
    });
    console.log("nPoints", this.state.nPoints);
    this.createTableInput(parseInt(this.state.nPoints));

    for (var i = 0; i < this.state.nPoints; i++) {
      for (var j = 0; j < this.state.X; j++) {
        document.getElementById("x" + (i + 1) + "" + (j + 1)).value =
          data.MultipleLinear.x[i][j];
      }
      document.getElementById("y" + (i + 1)).value = data.MultipleLinear.y[i];
    }

    for (var i = 0; i < this.state.X; i++) {
      console.log(data.MultipleLinear.xi[i]);
      document.getElementById("xi" + (i + 1)).value = data.MultipleLinear.xi[i];
    }

    this.forceUpdate();
  }

  componentDidMount() {
    //ทำอัตโนมัติหลังจาก render เสร็จ
  }
  componentDidUpdate() {}

  initialValue() {
    var X = this.state.X;
    var n = this.state.nPoints;
    x = [];
    y = [];
    for (var i = 0; i < n; i++) {
      x[i] = [];
      for (var j = 0; j < X; j++) {
        x[i][j] = parseInt(
          document.getElementById("x" + (i + 1) + "" + (j + 1)).value
        );
      }
    }
    for (i = 0; i < n; i++) {
      y[i] = parseFloat(document.getElementById("y" + (i + 1)).value);
    }
    console.log("x", x);
    console.log("y", y);
  }

  cal(nPoints) {
    console.log("x", x);
    console.log("y", y);
    console.log("nPoints", nPoints);
    if (x.length !== 0 && y.length !== 0) {
      var arr = [];
      var xi = [];
      for (let i = 1; i <= this.state.X; i++) {
        console.log(i, parseFloat(document.getElementById("xi" + i).value));
        xi[i - 1] = parseFloat(document.getElementById("xi" + i).value);
      }
      console.log("xi", xi);
      for (let i = 0; i < this.state.nPoints; i++) {
        var temp = [];
        for (let j = 0; j < this.state.X; j++) {
          temp.push(x[i][j]);
        }
        temp.push(y[i]);
        arr.push(temp);
      }

      console.log(arr);
      console.log(regression(arr));
      arr = regression(arr);
      let sum = arr[0];
      for (let i = 1; i < arr.length; i++) {
        sum += xi[i - 1] * arr[i];
      }
      console.log(sum);
      answer = sum;
    }
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

  createTableInput() {
    x = [];
    y = [];
    tableTag = [];
    matrixX = [];
    var n = this.state.nPoints;
    var X = this.state.X;
    console.log("n", n);
    console.log("X", X);
    // if (this.state.nPoints != null && this.state.X != null) {
    for (var i = 1; i <= n; i++) {
      x[i] = [];
      for (var j = 1; j <= X; j++) {
        x[i].push(
          <Input
            style={{
              width: "70%",
              height: "50%",
              backgroundColor: "black",
              marginInlineEnd: "5%",
              marginBlockEnd: "5%",
              color: "white",
              fontSize: "18px",
              fontWeight: "bold",
              justifyContent: "center",
            }}
            id={"x" + i + "" + j}
            key={"x" + i + "" + j}
            placeholder={"x" + i + "" + j}
          />
        );
      }
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
        x: x[i],
        y: y[i - 1],
      });
    }
    for (var j = 1; j <= X; j++) {
      matrixX.push(
        <Input
          style={{
            width: "18%",
            height: "50%",
            backgroundColor: "black",
            marginInlineEnd: "5%",
            marginBlockEnd: "5%",
            color: "white",
            fontSize: "18px",
            fontWeight: "bold",
          }}
          id={"xi" + j}
          key={"xi" + j}
          placeholder={"xi" + j}
        />
      );
    }
    this.setState({
      showTableInput: true,
    });
    console.log(x, y, tableTag);
    // }
    console.log("x", x);
    console.log("y", y);
    this.forceUpdate();
  }

  render() {
    return (
      <div>
        <h1>Multiple Linear Regression</h1>
        <div className="row">
          <div className="col">
            <div>
              <p>Number of points (n)</p>
              <Input
                onChange={async (e) => {
                  await this.setState({ nPoints: e.target.value });
                  this.createTableInput();
                  this.forceUpdate();
                }}
                value={this.state.nPoints}
                name="nPoints"
                placeholder="Number of points (n)"
              />
              <p>Number of X</p>
              <Input
                onChange={async (e) => {
                  await this.setState({ X: e.target.value });
                  this.createTableInput();
                  this.forceUpdate();
                }}
                value={this.state.X}
                name="X"
                placeholder="Number of X"
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
        {this.state.showTableInput && (
          <div>
            <h2>Input Matrix X</h2>
            {matrixX}
          </div>
        )}
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
