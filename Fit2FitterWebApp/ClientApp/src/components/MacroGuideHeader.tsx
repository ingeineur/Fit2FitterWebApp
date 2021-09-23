import * as React from 'react';
import { connect } from 'react-redux';
import { Grid } from 'semantic-ui-react'
import { IMacroGuides, IMeals } from '../models/meals';
import { IActivity } from '../models/activities'

interface IProps {
    meals: IMeals;
    guides: IMacroGuides;
    activities: IActivity[]
    update: boolean;
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
            return 'yellow';
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

    getDeficitColour = (remaining: number) => {
        if (remaining < 1.0) {
            return 'red';
        }

        if (remaining < 30.0) {
            return 'orange';
        }

        return 'green';
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
        var totalPortion: number = 0.0;

        for (let i = 0; i < 4; i++) {
            var meals = this.props.meals[this.getMealTypeIndex(i)].filter(x => x.remove !== true);
            totalCarb += (meals.reduce(function (a, b) { return a + parseFloat(b.carb.toString()) }, 0));
            totalProtein += (meals.reduce(function (a, b) { return a + parseFloat(b.protein.toString()) }, 0));
            totalFat += (meals.reduce(function (a, b) { return a + parseFloat(b.fat.toString()) }, 0));
            totalPortion += (meals.reduce(function (a, b) { return a + parseFloat(b.portion.toString()) }, 0));
        }

        const totalBurntCalories = (this.props.activities.reduce(function (a, b) { return a + b.calories; }, 0));

        const totalRemCarb = this.props.guides.carb - totalCarb;
        const totalRemProtein = this.props.guides.protein - totalProtein;
        const totalRemFat = this.props.guides.fat - totalFat;
        const totalCal = totalCarb * 4 + totalProtein * 4 + totalFat * 9;

        const totalMacro = this.props.guides.carb*4 + this.props.guides.protein*4 + this.props.guides.fat*9;
        const deficit = totalMacro - totalCal + totalBurntCalories;
        const deficitPercentage = (deficit / totalMacro) * 100.00;

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
                    <Grid.Column color={this.getDeficitColour(deficitPercentage)} textAlign='center'>
                        <div><a>Deficit(cal)</a></div>
                        <div style={divLabelStyle3}><a>{deficitPercentage.toFixed(0)}%</a></div>
                    </Grid.Column>
                </Grid.Row>
            </Grid>);
    }
}

export default connect()(MacroGuideHeader);