import * as React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';
import { Button, Form, Input, Grid, Label, Icon, Card, Header } from 'semantic-ui-react'
import { getSleepColour, getStepIndicatorColour } from '../models/activities';

interface IProps {
    activities: IActivity[];
    steps: number;
    sleeps: number;
    guides: IActivityGuides;
    update: boolean;
    age: number;
}

interface IActivityGuides {
    calories: number;
    steps: number;
}

interface IActivity {
    calories: number;
    steps: number;
    maxHr: number;
    activityDesc: string;
}

interface IState {
    username: string;
    password: string;
    updated: boolean;
}

class ActivityHeader extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);
        this.state = {
            username: '', password: '', updated: false
        };
    }

    getColour = (total: number) => {
        if (total > 50.0 && total < 100) {
            return 'orange';
        }

        if (total === 100) {
            return 'green';
        }

        if (total > 100.0) {
            return 'red';
        }

        return 'black';
    }

    getMaxHrColour = (maxHr: number) => {
        var calcMaxHr = 220 - this.props.age;
        var minMaxHr = 0.65 * calcMaxHr;
        var maxMaxHr = 0.85 * calcMaxHr;

        if (maxHr >= minMaxHr && maxHr <= maxMaxHr) {
            return 'green';
        }
        else if (maxHr > maxMaxHr && maxHr <= calcMaxHr) {
            return 'orange';
        }
        
        return 'red';
    }

    getIndicatorColour = (percent: number) => {
        if (percent >= 1.0) {
            return 'green';
        }

        return 'red';
    }

    getWarningText = () => {
        return (<Grid.Row>
            <a>Warning Text</a>
        </Grid.Row>
            )
    }

    render() {
        var divLabelStyle2 = {
            color: '#0a0212'
        };

        var divLabelStyle3 = {
            color: '#fffafa'
        };

        var divLabelStyle4 = {
            color: '#fffafa',
            fontFamily: 'Comic Sans MS',
            fontSize: '20px'
        };

        if (this.state.updated !== this.props.update)
        {
            this.setState({ updated: this.props.update });
        }

        const totalCalories = (this.props.activities.reduce(function (a, b) { return a + b.calories; }, 0));
        var maxHr: number = Math.max.apply(Math, this.props.activities.map(function (o) { return o.maxHr; }));
        if (this.props.activities.length < 1) {
            maxHr = 0;
        }

        const totalCaloriesPercent = (totalCalories / this.props.guides.calories);
        const totalStepsPercent = (this.props.steps / this.props.guides.steps);

        var divLabelStyle5 = {
            color: '#fffafa'
        };

        return (
            <Grid centered>
                <Grid.Row divided columns={4} textAlign='center'>
                    <Grid.Column color={this.getIndicatorColour(totalCaloriesPercent)} textAlign='center'>
                        <div><a>Calories</a></div>
                        <div style={divLabelStyle3}><a>{totalCalories}/{this.props.guides.calories}</a></div>
                    </Grid.Column>
                    <Grid.Column color={this.getMaxHrColour(maxHr)} textAlign='center'>
                        <div><a>Max HR</a></div>
                        <div style={divLabelStyle5}><a>{maxHr}/{220 - this.props.age}</a></div>
                    </Grid.Column>
                    <Grid.Column color={getStepIndicatorColour(totalStepsPercent)} textAlign='center'>
                        <div><a>Steps</a></div>
                        <div style={divLabelStyle3}><a>{this.props.steps}/{this.props.guides.steps}</a></div>
                    </Grid.Column>
                    <Grid.Column color={getSleepColour(this.props.sleeps)} textAlign='center'>
                        <div><a>Sleep</a></div>
                        <div style={divLabelStyle5}><a>{this.props.sleeps}</a></div>
                    </Grid.Column>
                </Grid.Row>
            </Grid>);
    }
}

export default connect()(ActivityHeader);