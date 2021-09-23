import * as React from 'react';
import { connect } from 'react-redux';
import { Grid, Segment } from 'semantic-ui-react'
import { IMacroGuides, IMeals } from '../models/meals';
import { IActivity } from '../models/activities'

interface IProps {
    meals: IMeals;
    activities: IActivity[];
    guides: IMacroGuides;
    update: boolean;
}

interface IState {
    username: string;
    password: string;
    updated: boolean;
}

class CaloriesRemainingHeader extends React.Component<IProps, IState> {

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

    getColour2 = (remaining: number) => {
        if (remaining < 1) {
            return 'red';
        }

        if (remaining < 500) {
            return 'orange';
        }

        return 'green';
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
            color: 'black',
            fontSize: '11px'
        };

        if (this.state.updated !== this.props.update)
        {
            this.setState({ updated: this.props.update });
        }

        const targetCalories = this.props.guides.carb * 4 + this.props.guides.protein * 4 + this.props.guides.fat * 9;

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

        const totalCal = totalCarb * 4 + totalProtein * 4 + totalFat * 9;

        var deficit = (targetCalories + totalBurntCalories - totalCal);
        var warning = deficit > 500 ?
            'Great! Your burned calories is more than intake calories' : 'Warning! Your burned calories is below ideal deficit (500 cal)';

        if (deficit <= 0) {
            warning = 'Danger! Your burned calories is less than the intake calories';
        }

        var divLabelStyle = {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: 'white',
            backgroundColor: this.getColour2(deficit)
        };

        var divLabelStyle6 = {
            color: this.getColour2(deficit),
            fontSize: '11px'
        };

        return (
            <div>
                <div style={divLabelStyle}>
                    <a>{warning}</a>
                </div>
                <Segment textAlign='center' attached='bottom'>
                    <Grid centered>
                        <Grid.Row columns={7} textAlign='center'>
                            <Grid.Column size={3} textAlign='center'>
                                <div style={divLabelStyle5}><a>{targetCalories.toFixed(0)}</a></div>
                            </Grid.Column>
                            <Grid.Column size={1} textAlign='center'>
                                <div><a>-</a></div>
                            </Grid.Column>
                            <Grid.Column size={3} textAlign='center'>
                                <div style={divLabelStyle5}><a>{totalCal.toFixed(0)}</a></div>
                            </Grid.Column>
                            <Grid.Column size={1} textAlign='center'>
                                <div><a>+</a></div>
                            </Grid.Column>
                            <Grid.Column size={3} textAlign='center'>
                                <div style={divLabelStyle5}><a>{totalBurntCalories.toFixed(0)}</a></div>
                            </Grid.Column>
                            <Grid.Column size={1} textAlign='center'>
                                <div><a>=</a></div>
                            </Grid.Column>
                            <Grid.Column size={4} textAlign='center'>
                                <div style={divLabelStyle6}><a>{deficit.toFixed(0)}</a></div>
                            </Grid.Column>
                            <Grid.Column size={3} textAlign='center'>
                                <div style={divLabelStyle5}><a>Macros Calories</a></div>
                            </Grid.Column>
                            <Grid.Column size={1} textAlign='center' />
                            <Grid.Column size={3} textAlign='center'>
                                <div style={divLabelStyle5}><a>Intake Calories</a></div>
                            </Grid.Column>
                            <Grid.Column size={1} textAlign='center' />
                            <Grid.Column size={3} textAlign='center'>
                                <div style={divLabelStyle5}><a>Exercise Calories</a></div>
                            </Grid.Column>
                            <Grid.Column size={1} textAlign='center' />
                            <Grid.Column size={4} textAlign='center'>
                                <div style={divLabelStyle6}><a>Deficit Calories</a></div>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Segment>
            </div>
            );
    }
}

export default connect()(CaloriesRemainingHeader);