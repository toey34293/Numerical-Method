import React, { Component } from "react";
import "antd/dist/antd.css";
import { Card, Input, Button, Table } from "antd";
import Desmos from "desmos";
import { addStyles, EditableMathField } from "react-mathquill";
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
    const url = "http://localhost:8000/Spline";
    // const url = "http://192.168.102.128:8000/Newton";
    // const url = "http://127.0.0.1/Json/item.json";
    const response = await fetch(url);
    console.log(response);
    const data = await response.json();
    console.log(data);
    this.setState({
      nPoints: data.Spline.nPoints,
      X: data.Spline.X,
    });
    console.log("nPoints", this.state.nPoints);
    this.createTableInput(parseInt(this.state.nPoints));

    for (var i = 0; i < this.state.nPoints; i++) {
      document.getElementById("x" + (i + 1)).value = data.Spline.x[i];
      document.getElementById("y" + (i + 1)).value = data.Spline.y[i];
    }

    this.forceUpdate();
  }

  spline(x, xs, ys) {
    var ks = xs.map(function () {
      return 0;
    });
    ks = this.getNaturalKs(xs, ys, ks);
    var i = 1;
    while (xs[i] < x) i++;
    var t = (x - xs[i - 1]) / (xs[i] - xs[i - 1]);
    var a = ks[i - 1] * (xs[i] - xs[i - 1]) - (ys[i] - ys[i - 1]);
    var b = -ks[i] * (xs[i] - xs[i - 1]) + (ys[i] - ys[i - 1]);
    var q =
      (1 - t) * ys[i - 1] + t * ys[i] + t * (1 - t) * (a * (1 - t) + b * t);
    console.log(q);
    this.setState({
      showOutputCard: true,
    });

    return q;
  }

  getNaturalKs(xs, ys, ks) {
    var n = xs.length - 1;
    var A = this.zerosMat(n + 1, n + 2);

    for (
      var i = 1;
      i < n;
      i++ // rows
    ) {
      A[i][i - 1] = 1 / (xs[i] - xs[i - 1]);
      A[i][i] = 2 * (1 / (xs[i] - xs[i - 1]) + 1 / (xs[i + 1] - xs[i]));
      A[i][i + 1] = 1 / (xs[i + 1] - xs[i]);
      A[i][n + 1] =
        3 *
        ((ys[i] - ys[i - 1]) / ((xs[i] - xs[i - 1]) * (xs[i] - xs[i - 1])) +
          (ys[i + 1] - ys[i]) / ((xs[i + 1] - xs[i]) * (xs[i + 1] - xs[i])));
    }

    A[0][0] = 2 / (xs[1] - xs[0]);
    A[0][1] = 1 / (xs[1] - xs[0]);
    A[0][n + 1] = (3 * (ys[1] - ys[0])) / ((xs[1] - xs[0]) * (xs[1] - xs[0]));

    A[n][n - 1] = 1 / (xs[n] - xs[n - 1]);
    A[n][n] = 2 / (xs[n] - xs[n - 1]);
    A[n][n + 1] =
      (3 * (ys[n] - ys[n - 1])) / ((xs[n] - xs[n - 1]) * (xs[n] - xs[n - 1]));

    return this.solve(A, ks);
  }

  solve(A, ks) {
    var m = A.length;
    for (
      var k = 0;
      k < m;
      k++ // column
    ) {
      // pivot for column
      var i_max = 0;
      var vali = Number.NEGATIVE_INFINITY;
      for (var i = k; i < m; i++)
        if (A[i][k] > vali) {
          i_max = i;
          vali = A[i][k];
        }
      this.swapRows(A, k, i_max);

      // for all rows below pivot
      for (i = k + 1; i < m; i++) {
        for (var j = k + 1; j < m + 1; j++)
          A[i][j] = A[i][j] - A[k][j] * (A[i][k] / A[k][k]);
        A[i][k] = 0;
      }
    }
    for (
      i = m - 1;
      i >= 0;
      i-- // rows = columns
    ) {
      var v = A[i][m] / A[i][i];
      ks[i] = v;
      for (
        j = i - 1;
        j >= 0;
        j-- // rows
      ) {
        A[j][m] -= A[j][i] * v;
        A[j][i] = 0;
      }
    }
    console.log(A);
    return ks;
  }

  zerosMat(r, c) {
    var A = [];
    for (var i = 0; i < r; i++) {
      A.push([]);
      for (var j = 0; j < c; j++) A[i].push(0);
    }
    return A;
  }

  swapRows(m, k, l) {
    var p = m[k];
    m[k] = m[l];
    m[l] = p;
  }

  componentDidMount() {
    //ทำอัตโนมัติหลังจาก render เสร็จ
  }
  componentDidUpdate() {}

  initialValue(X) {
    x = [];
    y = [];
    for (var i = 0; i < this.state.nPoints; i++) {
      x[i] = parseFloat(document.getElementById("x" + (i + 1)).value);
      y[i] = parseFloat(document.getElementById("y" + (i + 1)).value);
    }
    console.log("X", this.state.X);
    console.log("x", x);
    console.log("y", y);
    answer = this.spline(X, x, y);
    console.log("initialValue");
  }

  bi() {
    dataInTable = [];
    this.initialValue(parseFloat(this.state.X));
    console.log("answer", answer);
    dataInTable.push({
      Ans: answer,
    });

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
        <h1>Spline Interpolation</h1>
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
