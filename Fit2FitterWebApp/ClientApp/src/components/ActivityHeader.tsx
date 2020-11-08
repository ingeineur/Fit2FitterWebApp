import * as React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';
import { Button, Form, Input, Grid, Label, Icon, Card, Header } from 'semantic-ui-react'

interface IProps {
    activities: IActivity[];
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
    ActivityDesc: string;
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
            return 'teal';
        }

        if (total > 100.0) {
            return 'red';
        }

        return 'black';
    }

    getMaxHrColour = (maxHr: number) => {
        var calcMaxHr = 220 - this.props.age;
        var minMaxHr = 0.65 * calcMaxHr;
        var maxMaxHr = 0.75 * calcMaxHr;

        if (maxHr >= minMaxHr && maxHr <= maxMaxHr) {
            return 'green';
        }

        if (maxHr > maxMaxHr && maxHr < calcMaxHr) {
            return 'orange';
        }

        if (maxHr >= calcMaxHr) {
            return 'red';
        }

        return 'grey';
    }

    render() {
        var divLabelStyle2 = {
            color: '#0a0212',
            backgroundColor: 'Yellow'
        };

        var divLabelStyle3 = {
            color: '#fffafa',
            backgroundColor: 'Blue'
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
        const totalSteps = (this.props.activities.reduce(function (a, b) { return a + b.steps; }, 0));
        var maxHr: number = Math.max.apply(Math, this.props.activities.map(function (o) { return o.maxHr; }));
        if (this.props.activities.length < 1) {
            maxHr = 0;
        }
        const totalStepsPercent = (totalSteps / this.props.guides.steps) * 100.0;

        var divLabelStyle5 = {
            color: '#fffafa',
            backgroundColor: this.getMaxHrColour(maxHr)
        };

        return (
            <Grid centered>
                <Grid.Row columns={1} color='pink' textAlign='center'>
                    <a style={divLabelStyle4}>Total Activities</a>
                </Grid.Row>
                <Grid.Row columns={3} textAlign='center'>
                    <Grid.Column color='black' textAlign='center'>
                        <div><a>Calories</a></div>
                        <div style={divLabelStyle2}><a>{totalCalories}</a></div>
                    </Grid.Column>
                    <Grid.Column color='black' textAlign='center'>
                        <div><a>Steps</a></div>
                        <div style={divLabelStyle3}><a>{totalSteps}</a></div>
                    </Grid.Column>
                    <Grid.Column color='black' textAlign='center'>
                        <div><a>Max HR</a></div>
                        <div style={divLabelStyle5}><a>{maxHr}</a></div>
                    </Grid.Column>
                </Grid.Row>
            </Grid>);
    }
}

export default connect()(ActivityHeader);