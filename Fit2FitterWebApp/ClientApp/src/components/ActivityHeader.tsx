import * as React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';
import { Button, Form, Input, Grid, Label, Icon, Card, Header } from 'semantic-ui-react'

interface IProps {
    activities: IActivity[];
    guides: IActivityGuides;
    update: boolean;
}

interface IActivityGuides {
    calories: number;
    steps: number;
}

interface IActivity {
    calories: number;
    steps: number;
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

    render() {
        var divLabelStyle2 = {
            color: '#0a0212',
            backgroundColor: 'Yellow'
        };

        var divLabelStyle3 = {
            color: '#fffafa',
            backgroundColor: 'Red'
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

        const totalStepsPercent = (totalSteps / this.props.guides.steps) * 100.0;
        
        return (
            <Grid centered>
                <Grid.Row columns={1} color='pink' textAlign='center'>
                    <a style={divLabelStyle4}>Total Activities</a>
                </Grid.Row>
                <Grid.Row columns={2} textAlign='center'>
                    <Grid.Column color='black' textAlign='center'>
                        <div><a>Calories</a></div>
                        <div style={divLabelStyle2}><a>{totalCalories}</a></div>
                    </Grid.Column>
                    <Grid.Column color='black' textAlign='center'>
                        <div><a>Steps</a></div>
                        <div style={divLabelStyle3}><a>{totalSteps}</a></div>
                    </Grid.Column>
                </Grid.Row>
            </Grid>);
    }
}

export default connect()(ActivityHeader);