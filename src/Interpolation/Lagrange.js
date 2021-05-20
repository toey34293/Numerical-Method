import React, { Component } from "react";
import "antd/dist/antd.css";
import { Card, Input, Button, Table } from "antd";
import Desmos from "desmos";
import { addStyles, EditableMathField } from "react-mathquill";

import * as am4core from "@amcharts/amcharts4/core";
import "../components/Graph.css";
import "@amcharts/amcharts4/charts";
am4core.options.autoSetClassName = true;

const AlgebraLatex = require("algebra-latex");
const math = require("mathjs");

addStyles();

var dataInTable = [];
var columns2 = [
  // {
  //   title: "Ans",
  //   dataIndex: "Ans",
  //   key: "Ans",
  // },
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
  interpolatePoint = [],
  tempTag = [],
  fx,
  tag;

export default class Test extends Component {
  constructor(props) {
    super(props);
    this.bi = this.bi.bind(this);
    this.Ex = this.Ex.bind(this);
    this.state = {
      nPoints: null,
      ans: [],
      X: null,
      rows: [],
      interpolatePoint: null,
      showTableInput: false,
      showTableInpu2: false,
    };
    this.plot = [];
  }
  //API
  async Ex() {
    // const url = "https://api.randomuser.me/";
    const url = "http://192.168.102.128:8000/Newton";
    // const url = "http://192.168.102.128:8000/Newton";
    // const url = "http://127.0.0.1/Json/item.json";
    const response = await fetch(url);
    console.log(response);
    const data = await response.json();
    console.log(data);
    this.setState({
      nPoints: data.Newton.nPoints,
      X: data.Newton.X,
      interpolatePoint: data.Newton.interpolatePoint,
    });
    console.log("nPoints", this.state.nPoints);
    this.createTableInput(parseInt(this.state.nPoints));

    for (var i = 0; i < this.state.nPoints; i++) {
      document.getElementById("x" + (i + 1)).value = data.Newton.x[i];
      document.getElementById("y" + (i + 1)).value = data.Newton.y[i];
    }

    this.createInterpolatePointInput();
    for (var i = 0; i < this.state.interpolatePoint; i++) {
      document.getElementById("p" + (i + 1)).value = data.Newton.p[i];
    }
    this.initialValue();
    this.forceUpdate();
  }

  componentDidMount() {
    //ทำอัตโนมัติหลังจาก render เสร็จ
    const data = this.state.rows;
    console.log("data", data);
    const chartConfiguration = {
      type: "XYChart",
      data: data,
      xAxes: [
        {
          type: "ValueAxis",
        },
      ],
      yAxes: [
        {
          type: "ValueAxis",
        },
      ],
      series: [
        {
          type: "LineSeries",
          dataFields: {
            valueX: "x",
            valueY: "y",
          },
          groupFields: {
            valueY: "average",
          },
        },
      ],
    };
    console.log(data);
    this.chart = am4core.createFromConfig(
      JSON.parse(JSON.stringify(chartConfiguration)),
      "chartdiv"
    );
    console.log("Dis");
  }

  componentDidUpdate() {
    //ทำอัตโนมัติหลังจาก re-render เสร็จ
    const data = this.state.rows;
    console.log("data", data);
    const chartConfiguration = {
      type: "XYChart",
      data: data,
      xAxes: [
        {
          type: "ValueAxis",
        },
      ],
      yAxes: [
        {
          type: "ValueAxis",
        },
      ],
      series: [
        {
          type: "LineSeries",
          dataFields: {
            valueX: "x",
            valueY: "y",
          },
          groupFields: {
            valueY: "average",
          },
        },
      ],
    };
    console.log(data);
    this.chart = am4core.createFromConfig(
      JSON.parse(JSON.stringify(chartConfiguration)),
      "chartdiv"
    );
    console.log("UP");
  }

  componentWillUnmount() {
    //ทำอัตโนมัติหลังจากสลาย แล้วไปทำ componentDidUpdate
    if (this.chart) {
      this.chart.dispose();
    }
    this.forceUpdate();
    console.log("will");
  }

  initialSchema(n) {
    columns2 = [];
    for (var i = 0; i < n; i++) {
      columns2.push({
        title: "L" + i,
        dataIndex: "l" + i,
        key: "l" + i,
      });
    }
    columns2.push({
      title: "Ans",
      dataIndex: "Ans",
      key: "Ans",
    });
  }

  initialValue() {
    x = [];
    y = [];
    interpolatePoint = [];
    for (var i = 1; i <= this.state.nPoints; i++) {
      x[i] = parseFloat(document.getElementById("x" + i).value);
      y[i] = parseFloat(document.getElementById("y" + i).value);
    }
    for (i = 1; i <= this.state.interpolatePoint; i++) {
      interpolatePoint[i] = parseInt(document.getElementById("p" + i).value);
    }
    //loop set ค่า plot
    for (var i = 0; i < x.length - 1; i++) {
      this.plot[i] = { x: x[i + 1], y: y[i + 1] }; //plot[0]={x:0,y=9.81}
    }
    this.setState({ rows: this.plot });
    console.log("initialValue");
  }

  L(X, index, n) {
    var numerate = 1 /*ตัวเศษ*/,
      denominate = 1; /*ตัวส่วน*/
    for (var i = 1; i <= n; i++) {
      if (i !== index) {
        numerate *= X - x[i];
        denominate *= x[index] - x[i];
      }
    }
    console.log(numerate / denominate);
    return parseFloat(numerate / denominate);
  }

  lagrange(n, X) {
    fx = 0;
    this.initialValue();
    tag = "{";
    console.log("lagrange1");
    for (var i = 1; i <= n; i++) {
      var ln = this.L(X, i, n);

      tag += '"l' + (i - 1) + '": ' + ln + ",";

      fx += ln * y[i];
    }
    console.log("tag", tag);

    this.setState({
      showOutputCard: true,
    });
  }

  bi() {
    dataInTable = [];
    this.initialSchema(this.state.interpolatePoint);
    this.lagrange(
      parseInt(this.state.interpolatePoint),
      parseFloat(this.state.X)
    );

    tag += '"Ans":' + fx + "}";
    console.log("tag", tag);
    dataInTable.push(JSON.parse(tag));
    console.log("lagrange2");
    console.log(dataInTable);

    console.log("end");
    this.forceUpdate();
  }

  createInterpolatePointInput() {
    tempTag = [];
    for (var i = 1; i <= this.state.interpolatePoint; i++) {
      tempTag.push(
        <Input
          style={{
            width: "14%",
            height: "50%",
            backgroundColor: "black",
            marginInlineEnd: "5%",
            marginBlockEnd: "5%",
            color: "white",
            fontSize: "18px",
            fontWeight: "bold",
          }}
          id={"p" + i}
          key={"p" + i}
          placeholder={"p" + i}
        />
      );
    }
    this.setState({
      showTableInput2: true,
    });
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
          onChange={async (e) => {
            this.initialValue();
            this.forceUpdate();
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
        <h1>Lagrange</h1>
        <div id="chartdiv">
          {console.log("rows", this.state.rows)}
          {/* <Graph data={this.state.rows} /> */}
        </div>
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
                  this.setState({ X: e.target.value }); //x=42000;
                  this.forceUpdate();
                }}
                value={this.state.X}
                name="X"
                placeholder="X"
              />
              <p>interpolatePoint</p>
              <Input
                onChange={async (e) => {
                  await this.setState({ interpolatePoint: e.target.value });
                  this.createInterpolatePointInput();
                  this.forceUpdate();
                }}
                value={this.state.interpolatePoint}
                name="interpolatePoint"
                placeholder="interpolatePoint"
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
        {this.state.showTableInput2 && (
          <div>
            <h2>
              interpolatePoint{" "}
              {parseInt(this.state.interpolatePoint) === 2
                ? "(Linear)"
                : parseInt(this.state.interpolatePoint) === 3
                ? "(Quadratic)"
                : "(Polynomial)"}
            </h2>
            {tempTag}
          </div>
        )}
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
        )}
      </div>
    );
  }
}
