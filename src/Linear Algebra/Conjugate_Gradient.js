import React, { Component } from "react";
import "antd/dist/antd.css";
import { Card, Input, Button, Table } from "antd";
import Desmos from "desmos";
import { addStyles, EditableMathField } from "react-mathquill";
import { det, add, subtract, multiply, transpose } from "mathjs";
const AlgebraLatex = require("algebra-latex");
const math = require("mathjs");

addStyles();

var dataInTable = [];

var A = [],
  B = [],
  matrixA = [],
  matrixB = [],
  matrixX = [],
  epsilon,
  count = 1,
  output,
  x = [];

var columns = [
  {
    title: "Iteration",
    dataIndex: "iteration",
    key: "iteration",
  },
  {
    title: "λ",
    dataIndex: "lambda",
    key: "lambda",
  },
  {
    title: "{X}",
    dataIndex: "X",
    key: "X",
  },
  {
    title: "Error",
    dataIndex: "error",
    key: "error",
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
    const url = "http://localhost:8000/Conjugate_Gradient";
    // const url = "http://127.0.0.1/Json/item.json";
    const response = await fetch(url);
    console.log(response);
    const data = await response.json();
    console.log(data);
    this.setState({
      Dimension: data.Conjugate_Gradient.Dimension,
    });
    this.createMatrix(this.state.Dimension, this.state.Dimension);

    for (var i = 0; i < this.state.Dimension; i++) {
      for (var j = 0; j < this.state.Dimension; j++) {
        document.getElementById("a" + (i + 1) + "" + (j + 1)).value =
          data.Conjugate_Gradient.A[i][j];
        document.getElementById("b" + (i + 1)).value =
          data.Conjugate_Gradient.B[0];
        document.getElementById("x" + (i + 1)).value =
          data.Conjugate_Gradient.X[i];
      }
    }
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

  positive_definite(dimention) {
    console.log("A", dimention);
    console.log(A);
    var tempMatrix = [];
    for (var i = 0; i < dimention; i++) {
      tempMatrix[i] = [];
      for (var j = 0; j < dimention; j++) {
        tempMatrix[i][j] = A[i][j];
      }
    }
    if (det(tempMatrix) <= 0) {
      return false;
    }
    if (dimention !== this.state.Dimension - 1) {
      return this.positive_definite(++dimention);
    }
    return true;
  }

  cal() {
    // var n = this.state.Dimension;
    this.initMatrix();
    if (!this.positive_definite(1)) {
      output = "This matrix doesn't positive definite";
      this.setState({
        showOutputCard: true,
      });
      return false;
    }
    //find {R0}
    var R = subtract(multiply(A, x), B);
    console.log(R);
    //find D0
    var D = multiply(R, -1);
    console.log(D);
    do {
      //find λ
      var λ =
        multiply(multiply(transpose(D), R), -1) /
        multiply(multiply(transpose(D), A), D);
      console.log(λ);
      /*------------------------------------------------------------------*/

      //find new {X}
      x = add(x, multiply(λ, D));
      console.log(x);
      //find new {R}
      R = subtract(multiply(A, x), B);
      console.log(R);
      //find epsilon
      epsilon = Math.sqrt(multiply(transpose(R), R)).toFixed(8);
      this.appendTable(λ, JSON.stringify(x).split(",").join(",\n"), epsilon);
      console.log(epsilon);
      var α =
        multiply(multiply(transpose(R), A), D) /
        multiply(transpose(D), multiply(A, D)).toFixed(8);
      console.log(α);
      D = add(multiply(R, -1), multiply(α, D));
      console.log(D);
    } while (epsilon > 0.000001);
    output = x;
    this.setState({
      showOutputCard: true,
    });
    this.forceUpdate();
  }

  appendTable(lambda, x, error) {
    dataInTable.push({
      iteration: count++,
      lambda: lambda,
      X: x,
      error: error,
    });
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

  render() {
    return (
      <div>
        <h1>Conjugate Gradient</h1>
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
