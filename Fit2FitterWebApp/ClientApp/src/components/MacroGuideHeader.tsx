import * as React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';
import { Button, Form, Input, Grid, Label, Icon, Card, Header } from 'semantic-ui-react'

interface IProps {
    meals: IMeals;
    guides: IMacroGuides;
    update: boolean;
}

interface IMacroGuides {
    carb: number;
    protein: number;
    fat: number;
    fruits: number;
}

interface IMeals {
    0: IMealDetails[];
    1: IMealDetails[];
    2: IMealDetails[];
    3: IMealDetails[];
}

interface IMealDetails {
    id: number;
    food: string;
    carb: number;
    protein: number;
    fat: number;
    fv: number;
    photo: string;
    check: boolean;
    remove: boolean;
}

interface IState {
    username: string;
    password: string;
    updated: boolean;
}

class MacroGuideHeader extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);
        this.state = {
            username: '', password: '', updated: false
        };
    }

    getColour = (total: number) => {
        if (total === 1.0) {
            return 'teal';
        }

        if (total > 1.0) {
            return 'red';
        }

        return 'yellow';
    }

    getColour2 = (total: number) => {
        if (total === 1.0) {
            return 'teal';
        }

        if (total > 1.0) {
            return 'teal';
        }

        return 'yellow';
    }

    getMealTypeIndex = (type: number) => {
        if (type == 1) {
            return 1;
        }
        if (type == 2) {
            return 2;
        }
        if (type == 3) {
            return 3;
        }

        return 0;
    }

    render() {

        var divLabelStyle1 = {
            color: 'black'
        };

        var divLabelStyle2 = {
            color: 'black'
        };

        var divLabelStyle3 = {
            color: 'black'
        };

        var divLabelStyle4 = {
            color: '#fffafa',
            fontSize: '20px'
        };

        var divLabelStyle5 = {
            color: 'black'
        };

        if (this.state.updated !== this.props.update)
        {
            this.setState({ updated: this.props.update });
        }

        var totalCarb: number = 0.0;
        var totalProtein: number = 0.0;
        var totalFat: number = 0.0;
        var totalVeg: number = 0.0;

        for (let i = 0; i < 4; i++) {
            var meals = this.props.meals[this.getMealTypeIndex(i)].filter(x => x.remove !== true);
            totalCarb += (meals.reduce(function (a, b) { return a + parseFloat(b.carb.toString()) }, 0));
            totalProtein += (meals.reduce(function (a, b) { return a + parseFloat(b.protein.toString()) }, 0));
            totalFat += (meals.reduce(function (a, b) { return a + parseFloat(b.fat.toString()) }, 0));
            totalVeg += (meals.reduce(function (a, b) { return a + parseFloat(b.fv.toString()) }, 0));
        }

        const totalRemCarb = this.props.guides.carb - totalCarb;
        const totalRemProtein = this.props.guides.protein - totalProtein;
        const totalRemFat = this.props.guides.fat - totalFat;
        const totalRemVeg = this.props.guides.fruits - totalVeg;

        return (
            <Grid centered>
                <Grid.Row divided columns={4} textAlign='center'>
                    <Grid.Column color={this.getColour(totalCarb / this.props.guides.carb)} textAlign='center'>
                        <div><a>Carb(g)</a></div>
                        <div style={divLabelStyle1}><a>{totalRemCarb.toFixed(2)}</a></div>
                    </Grid.Column>
                    <Grid.Column color={this.getColour(totalProtein / this.props.guides.protein)} textAlign='center'>
                        <div><a>Protein(g)</a></div>
                        <div style={divLabelStyle2}><a>{totalRemProtein.toFixed(2)}</a></div>
                    </Grid.Column>
                    <Grid.Column color={this.getColour(totalFat / this.props.guides.fat)} textAlign='center'>
                        <div><a>Fat(g)</a></div>
                        <div style={divLabelStyle3}><a>{totalRemFat.toFixed(2)}</a></div>
                    </Grid.Column>
                    <Grid.Column color={this.getColour2(totalVeg / this.props.guides.fruits)} textAlign='center'>
                        <div><a>Serv</a></div>
                        <div style={divLabelStyle5}><a>{totalRemVeg}</a></div>
                    </Grid.Column>
                </Grid.Row>
            </Grid>);
    }
}

export default connect()(MacroGuideHeader);