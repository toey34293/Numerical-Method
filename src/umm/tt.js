import React from "react";

export default class FetchRandomUser extends React.Component {
  state = {
    loading: true,
    Funtion: null,
  };

  // async componentDidMount() {
  //   // const url = "https://api.randomuser.me/";
  //   const url = "http://localhost:8000/Bisection";
  //   // const url = "http://127.0.0.1/Json/item.json";
  //   const response = await fetch(url);
  //   console.log(response);
  //   const data = await response.json();
  //   console.log(data);
  //   this.setState({ Funtion: data.Bisection, loading: false });
  // }

  // render() {
  //   if (this.state.loading) {
  //     return <div>loading...</div>;
  //   }

  //   if (!this.state.Funtion) {
  //     return <div>didn't get a Funtion</div>;
  //   }

  //   return (
  //     <div>
  //       <div>{this.state.Funtion.Funtion}</div>
  //       <div>{this.state.Funtion.XL}</div>
  //       <div>{this.state.Funtion.XR}</div>
  //     </div>
  //   );
  // }

  async componentDidMount() {
    const url = "http://192.168.102.128:8000/test";
    const response = await fetch(url);
    const data = await response.json();
    this.setState({ people: data.results, loading: false });
  }

  render() {
    if (this.state.loading) {
      return <div>loading...</div>;
    }

    if (!this.state.people.length) {
      return <div>didn't get a person</div>;
    }

    // const peopleJsx = [];

    // this.state.people.forEach(person => {
    //   peopleJsx.push(
    //     <div key={person.name.first + person.name.last}>
    //       <div>{person.name.title}</div>
    //       <div>{person.name.first}</div>
    //       <div>{person.name.last}</div>
    //       <img src={person.picture.large} />
    //     </div>
    //   );
    // });

    return (
      <div>
        {this.state.people.map((person) => (
          <div key={person.name.first + person.name.last}>
            <div>{person.name.title}</div>
            <div>{person.name.first}</div>
            <div>{person.name.last}</div>
            <img src={person.picture.large} />
          </div>
        ))}
      </div>
    );
  }
}
