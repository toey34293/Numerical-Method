import React from "react";

export default class FetchRandomUser extends React.Component {
  state = {
    loading: true,
    Funtion: null,
  };

  async componentDidMount() {
    // const url = "https://api.randomuser.me/";
    const url = "http://localhost:8000/Bisection";
    // const url = "http://127.0.0.1/Json/item.json";
    const response = await fetch(url);
    console.log(response);
    const data = await response.json();
    console.log(data);
    this.setState({ Funtion: data.Bisection, loading: false });
  }

  render() {
    if (this.state.loading) {
      return <div>loading...</div>;
    }

    if (!this.state.Funtion) {
      return <div>didn't get a Funtion</div>;
    }

    return (
      <div>
        <div>{this.state.Funtion.Funtion}</div>
        <div>{this.state.Funtion.XL}</div>
        <div>{this.state.Funtion.XR}</div>
      </div>
    );
  }
}
