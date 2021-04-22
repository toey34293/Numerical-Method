import React, { Component } from "react";
import "antd/dist/antd.css";
import { Card, Input, Button, Table } from "antd";
import Desmos from "desmos";
import { addStyles, EditableMathField } from "react-mathquill";
import { lusolve, format } from "mathjs";
const AlgebraLatex = require("algebra-latex");
const math = require("mathjs");

addStyles();

var dataInTable = [];

var A = [],
  B = [],
  answer = [],
  matrixA = [],
  matrixB = [],
  matrixX = [],
  epsilon,
  count = 1,
  x = [];

var columns = [
  {
    title: "Iteration",
    dataIndex: "iteration",
    key: "iteration",
  },
];

export default class Test extends Component {
  constructor(props) {
    super(props);
    this.bi = this.bi.bind(this);
    this.Ex = this.Ex.bind(this);
    this.createTable = this.createTable.bind(this);
    this.initMatrix = this.initMatrix.bind(this);
    this.state = { Dimension: null, chDi: false, showOutputCard: false };
  }
  //API
  async Ex() {
    // const url = "https://api.randomuser.me/";
    const url = "http://192.168.102.128:8000/Jacobi";
    // const url = "http://127.0.0.1/Json/item.json";
    const response = await fetch(url);
    console.log(response);
    const data = await response.json();
    console.log(data);
    this.setState({
      Dimension: data.Jacobi.Dimension,
    });
    this.createMatrix(this.state.Dimension, this.state.Dimension);

    for (var i = 0; i < this.state.Dimension; i++) {
      for (var j = 0; j < this.state.Dimension; j++) {
        document.getElementById("a" + (i + 1) + "" + (j + 1)).value =
          data.Jacobi.A[i][j];
        document.getElementById("b" + (i + 1)).value = data.Jacobi.B[i][0];
        document.getElementById("x" + (i + 1)).value = data.Jacobi.X[i];
      }
    }
    this.initialSchema(this.state.Dimension);
  }

  componentDidMount() {
    //ทำอัตโนมัติหลังจาก render เสร็จ
    // this.initialSchema(this.state.Dimension);
  }

  initMatrix() {
    for (var i = 0; i < this.state.Dimension; i++) {
      A[i] = [];
      for (var j = 0; j < this.state.Dimension; j++) {
        A[i][j] = parseFloat(
          document.getElementById("a" + (i + 1) + "" + (j + 1)).value
        );
      }
      B.push(parseFloat(document.getElementById("b" + (i + 1)).value));
      x.push(parseFloat(document.getElementById("x" + (i + 1)).value));
    }
    console.log("initMatrix");
    console.log(x);
  }

  cal() {
    var n = this.state.Dimension;
    this.initMatrix();
    var temp;
    var xold;
    epsilon = new Array(n);
    console.log("while");
    do {
      temp = [];
      xold = JSON.parse(JSON.stringify(x));
      for (var i = 0; i < n; i++) {
        var sum = 0;
        for (var j = 0; j < n; j++) {
          if (i !== j) {
            //else i == j That is a divide number
            sum = sum + A[i][j] * x[j];
          }
        }
        temp[i] = (B[i] - sum) / A[i][i]; //update x[i]
      }
      x = JSON.parse(JSON.stringify(temp));
      console.log("count", count);
      if (count >= 1000) {
        break;
      }
    } while (this.error(x, xold)); //if true , continue next iteration
    this.setState({
      showOutputCard: true,
    });
  }

  error(xnew, xold) {
    for (var i = 0; i < xnew.length; i++) {
      epsilon[i] = Math.abs((xnew[i] - xold[i]) / xnew[i]);
      if (x[i] == null) {
        return true;
      }
    }

    this.appendTable(x, epsilon);
    for (i = 0; i < epsilon.length; i++) {
      if (epsilon[i] > 0.000001) {
        return true;
      }
    }
    return false;
  }

  appendTable(x, error) {
    console.log("appendTable");
    console.log(x, error);
    var tag = "";
    tag += '{"iteration": ' + count++ + ",";
    for (var i = 0; i < x.length; i++) {
      tag +=
        '"x' +
        (i + 1) +
        '": ' +
        x[i].toFixed(8) +
        ', "error' +
        (i + 1) +
        '": ' +
        error[i].toFixed(8);
      if (i !== x.length - 1) {
        tag += ",";
      }
    }
    tag += "}";
    dataInTable.push(JSON.parse(tag));
    console.log(dataInTable);
    this.forceUpdate();
  }

  bi() {
    this.cal();
    // this.createTable(data["x"]);
    console.log("submit");
  }

  createTable(x) {
    dataInTable = [];
    for (var i = 0; i < x.length; i++) {
      dataInTable.push({
        iteration: "X" + i,
        x: x[i],
      });
    }
    this.forceUpdate();
  }

  createMatrix(row, column) {
    matrixA = [];
    matrixB = [];
    matrixX = [];
    console.log(row + " " + column);
    for (var i = 1; i <= row; i++) {
      for (var j = 1; j <= column; j++) {
        matrixA.push(
          <Input
            style={{
              width: "15%",
              height: "50%",
              backgroundColor: "black",
              marginInlineEnd: "5%",
              marginBlockEnd: "5%",
              color: "white",
              fontSize: "18px",
              fontWeight: "bold",
            }}
            id={"a" + i + "" + j}
            key={"a" + i + "" + j}
            placeholder={"a" + i + "" + j}
          />
        );
      }
      matrixA.push(<br />);
      matrixB.push(
        <Input
          style={{
            width: "15%",
            height: "50%",
            backgroundColor: "black",
            marginInlineEnd: "5%",
            marginBlockEnd: "5%",
            color: "white",
            fontSize: "18px",
            fontWeight: "bold",
          }}
          id={"b" + i}
          key={"b" + i}
          placeholder={"b" + i}
        />
      );
      matrixB.push(<br />);
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
          id={"x" + i}
          key={"x" + i}
          placeholder={"x" + i}
        />
      );
    }
    this.setState({ chDi: true });
    console.log("matrixX");
    console.log(matrixX);
  }

  initialSchema(n) {
    for (var i = 1; i <= n; i++) {
      columns.push({
        title: "X" + i,
        dataIndex: "x" + i,
        key: "x" + i,
      });
    }
    for (i = 1; i <= n; i++) {
      columns.push({
        title: "Error" + i,
        dataIndex: "error" + i,
        key: "error" + i,
      });
    }
    console.log("initialSchema");
    console.log(columns);
  }

  render() {
    return (
      <div>
        <h1>Jacobi Iteration</h1>
        <div className="row">
          <div className="col">
            <div>
              <p>Dimension</p>
              <Input
                onChange={async (e) => {
                  await this.setState({ Dimension: e.target.value });
                  this.createMatrix(this.state.Dimension, this.state.Dimension);

                  this.forceUpdate();
                  //   console.log(this.state.Dimension);
                }}
                value={this.state.Dimension}
                name="Dimension"
                placeholder="Dimension"
              />
              <br></br>
              <br></br>
              <Button onClick={this.bi} type="primary">
                Submit
              </Button>
              <Button
                style={{
                  marginLeft: "50%",
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
            {this.state.chDi && (
              <div
                style={{
                  textAlign: "right",
                }}
              >
                <h2>Input Matrix A</h2>
                {matrixA}
              </div>
            )}
          </div>
          <div className="col">
            {this.state.chDi && (
              <div>
                <h2>Input Matrix B</h2>
                {matrixB}
              </div>
            )}
          </div>
        </div>
        {this.state.chDi && (
          <div>
            <h2>Input Matrix X</h2>
            {matrixX}
          </div>
        )}
        {/* {this.state.ans.map((data, i) => {
          return (
            <p>
              Iteration No.{i + 1} Root of equation is {data}
            </p>
          );
        })} */}
        {this.state.showOutputCard && (
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
              // bordered
              dataSource={dataInTable}
              bodyStyle={{
                fontWeight: "bold",
                fontSize: "18px",
                color: "black",
              }}
            ></Table>
          </Card>
        )}
      </div>
    );
  }
}
