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

        if (remaining < 500.0) {
            return 'yellow';
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

        var foodPortionStyle = {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
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

        const totalCup = Math.round(totalCarb / 30);
        const totalPalm = Math.round(totalProtein/30);
        const totalThumb = Math.round(totalFat / 12);

        const totalGuideCup = Math.round(this.props.guides.carb / 30);
        const totalGuidePalm = Math.round(this.props.guides.protein / 30);
        const totalGuideThumb = Math.round(this.props.guides.fat / 12);

        const totalMacro = this.props.guides.carb*4 + this.props.guides.protein*4 + this.props.guides.fat*9;
        const deficit = totalMacro - totalCal + totalBurntCalories;
        const deficitPercentage = (deficit / totalMacro) * 100.00;

        return (
            <Grid centered>
                <Grid.Row columns={3} stretched textAlign='center'>
                    <Grid.Column textAlign='center'>
                        <div style={foodPortionStyle}>
                            <img style={foodPortionStyle} src={'cup.PNG'} width='50' height='50' />
                        </div>
                        <div><a>Carb</a></div>
                        <div style={divLabelStyle1}>{totalCup.toFixed(0)}/{totalGuideCup.toFixed(0)}</div>
                    </Grid.Column>
                    <Grid.Column textAlign='center'>
                        <div style={foodPortionStyle}>
                            <img style={foodPortionStyle} src={'palm.PNG'} width='50' height='50' />
                        </div>
                        <div><a>Protein</a></div>
                        <div style={divLabelStyle1}>{totalPalm.toFixed(0)}/{totalGuidePalm.toFixed(0)}</div>
                    </Grid.Column>
                    <Grid.Column textAlign='center'>
                        <div style={foodPortionStyle}>
                            <img style={foodPortionStyle} src={'thumb.PNG'} width='50' height='50' />
                        </div>
                        <div><a>Fat</a></div>
                        <div style={divLabelStyle1}>{totalThumb.toFixed(0)}/{totalGuideThumb.toFixed(0)}</div>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={3} stretched textAlign='center'>
                    <Grid.Column color={this.getColour(totalCarb / this.props.guides.carb)} textAlign='center'>
                        <div style={divLabelStyle1}><a>{totalRemCarb.toFixed(2)}g</a></div>
                    </Grid.Column>
                    <Grid.Column color={this.getColour(totalProtein / this.props.guides.protein)} textAlign='center'>
                        <div style={divLabelStyle2}><a>{totalRemProtein.toFixed(2)}g</a></div>
                    </Grid.Column>
                    <Grid.Column color={this.getColour(totalFat / this.props.guides.fat)} textAlign='center'>
                        <div style={divLabelStyle3}><a>{totalRemFat.toFixed(2)}g</a></div>
                    </Grid.Column>
                </Grid.Row>
            </Grid>);
    }
}

export default connect()(MacroGuideHeader);