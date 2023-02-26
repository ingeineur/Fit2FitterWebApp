import * as React from 'react';
import { connect } from 'react-redux';
import { Grid } from 'semantic-ui-react'
import { getSleepColour, getStepIndicatorColour, getIndicatorColour, getMaxHrColour } from '../models/activities';
import {
    Card,
    Metric,
    Text,
    Flex
} from '@tremor/react';

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

    getWarningText = () => {
        return (<Grid.Row>
            <a>Warning Text</a>
        </Grid.Row>
            )
    }

    getStepsStatus = (steps: number) => {
        var status = 'Keep Moving';
        if (steps >= this.props.guides.steps) {
            status = 'Excellent!! Target Achieved';
        }
        else if (steps > this.props.guides.steps / 2) {
            status = 'Great!! Almost There';
        }
        return status;
    }

    getSleepsStatus = (sleeps: number) => {
        var status = 'You need more rest';
        if (sleeps >= 6.5) {
            status = 'Excellent!! Your Body is Well Rested';
        }

        return status;
    }

    getHeartRateStatus = (maxHr: number) => {
        if (maxHr > (220 - this.props.age)) {
            return 'Warning!!!: Exceeding your max heart-rate is not advisable';
        }
        else if (maxHr === (220 - this.props.age)) {
            return 'Awesome!!!: Your body will keep burning for the next 24 Hours';
        }
        else if (maxHr > (0.65 * (220 - this.props.age))) {
            return 'Excellent: Your body will keep burning for the next 12 Hours';
        }
        else if (maxHr > 0) {
            return 'Great work so far';
        }
        else {
            return 'No MAX HR detected!!';
        }
    }

    GetStepMetric = () => {
        return (
            <Card key="Steps">
                <Flex alignItems="items-center">
                    <Text>STEPS</Text>
                </Flex>
                <Flex
                    justifyContent="justify-center"
                    alignItems="items-center"
                    spaceX="space-x-3"
                    truncate={true}
                >
                    <Metric color={getStepIndicatorColour(this.props.steps / this.props.guides.steps)}>{this.props.steps}</Metric>
                </Flex>
                <Flex>
                    <div>
                        <Text> {this.getStepsStatus(this.props.steps)} </Text>
                    </div>
                </Flex>
            </Card>
        );
    }

    GetCaloriesMetric = (coloriesPercent: number, totalCalories: number) => {
        return (
            <Card key="Calories">
                <Flex alignItems="items-center">
                    <Text>CALORIES</Text>
                </Flex>
                <Flex
                    justifyContent="justify-center"
                    alignItems="items-center"
                    spaceX="space-x-3"
                    truncate={true}
                >
                    <Metric color={getIndicatorColour(coloriesPercent)}>{totalCalories}</Metric>
                </Flex>
            </Card>
        );
    }

    GetMaxHrMetric = (maxHr: number) => {
        return (
            <Card key="MAXHR">
                <Flex alignItems="items-center">
                    <Text>MAX HR</Text>
                </Flex>
                <Flex
                    justifyContent="justify-center"
                    alignItems="items-center"
                    spaceX="space-x-3"
                    truncate={true}
                >
                    <Metric color={getMaxHrColour(maxHr, this.props.age)}>{maxHr}/{220 - this.props.age}</Metric>
                </Flex>
                <Flex>
                    <div>
                        <Text color={getMaxHrColour(maxHr, this.props.age)}> {this.getHeartRateStatus(maxHr)} </Text>
                    </div>
                </Flex>
            </Card>
        );
    }

    GetSleepMetric = () => {
        return (
            <Card key="SLEEP">
                <Flex alignItems="items-center">
                    <Text>SLEEP</Text>
                </Flex>
                <Flex
                    justifyContent="justify-center"
                    alignItems="items-center"
                    spaceX="space-x-3"
                    truncate={true}
                >
                    <Metric color={getSleepColour(this.props.sleeps)}>{this.props.sleeps}</Metric>
                </Flex>
                <Flex>
                    <div>
                        <Text> {this.getSleepsStatus(this.props.sleeps)} </Text>
                    </div>
                </Flex>
            </Card>
        );
    }

    render() {
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
        
        return (
            <Grid centered>
                <Grid.Row textAlign='center'>
                    <Grid.Column width={16} textAlign='center'>
                        <Grid centered>
                            <Grid.Row textAlign='center' columns={2} stretched={true}>
                                <Grid.Column textAlign='center' stretched={true}>
                                    {this.GetStepMetric()}
                                </Grid.Column>
                                <Grid.Column textAlign='center' stretched={true}>
                                    {this.GetCaloriesMetric(totalCaloriesPercent, totalCalories)}
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Grid.Column>
                    <Grid.Column width={16} textAlign='center'>
                        <Grid centered>
                            <Grid.Row textAlign='center' stretched={true} columns={2}>
                                <Grid.Column stretched={true} textAlign='center'>
                                    {this.GetMaxHrMetric(maxHr)}
                                </Grid.Column>
                                <Grid.Column stretched={true} textAlign='center'>
                                    {this.GetSleepMetric()}
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Grid.Column>
                </Grid.Row>
            </Grid>);
    }
}

export default connect()(ActivityHeader);