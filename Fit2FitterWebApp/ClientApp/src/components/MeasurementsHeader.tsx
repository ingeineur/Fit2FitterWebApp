import * as React from 'react';
import { connect } from 'react-redux';
import { Grid } from 'semantic-ui-react';
import { IMeasurements, calcBodyFatPercent, getBodyFatIndicator, getColour, getBmiColour, getBmiClassification, calcBmi } from '../models/measurement';
import {
    Card,
    Metric,
    Text,
    Flex,
    BadgeDelta,
    DeltaType,
    ColGrid,
} from '@tremor/react';

interface IProps {
    measurements: IMeasurements;
    age: number;
    height: number;
    targetWeight: number;
    update: boolean;
}

interface IState {
    username: string;
    password: string;
    updated: boolean;
}

class MeasurementsHeader extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);
        this.state = {
            username: '', password: '', updated: false
        };
    }

    getWeightDeltaType = () => {
        var delta = this.props.measurements.weight - this.props.targetWeight;

        if (delta > 0.0) {
            return 'moderateIncrease'
        }

        return 'moderateDecrease'
    }

    getWeightDelta = () => {
        var delta = this.props.measurements.weight - this.props.targetWeight;
        return delta.toPrecision(2);
    }

    GetWeightMetric = () => {
        return (
            <Card key="Weight">
                <Flex alignItems="items-start">
                    <Text>WEIGHT</Text>
                </Flex>
                <Flex alignItems="items-start">
                    <Text>FROM GOAL</Text>
                </Flex>
                <Flex>
                    <Metric>{this.props.measurements.weight}</Metric>
                    <Text>
                        from
                        {' '}
                        {this.props.targetWeight}
                    </Text>
                </Flex>
                <Flex alignItems="items-start">
                    <BadgeDelta isIncreasePositive={false} deltaType={this.getWeightDeltaType()} text={this.getWeightDelta()} />
                </Flex>
            </Card>
        );
    }

    GetBodyFatMetric = (bodyFat: string) => {
        return (
            <Card key="BODYFAT">
                <Flex alignItems="items-center">
                    <Text>BODY FAT %</Text>
                </Flex>
                <Flex
                    justifyContent="justify-center"
                    alignItems="items-center"
                    spaceX="space-x-3"
                    truncate={true}
                >
                    <Metric>{bodyFat}%</Metric>
                </Flex>
            </Card>
        );
    }

    GetBodyTypeMetric = (level: string) => {
        return (
            <Card key="BODYTYPE">
                <Flex alignItems="items-center">
                    <Text>YOUR RATING</Text>
                </Flex>
                <Flex
                    justifyContent="justify-start"
                    alignItems="items-baseline"
                >
                    <Metric color={getColour(level)}>{level}</Metric>
                </Flex>
            </Card>
        );
    }

    GetBmiMetric = (level: string) => {
        return (
            <Card key="BMI">
                <Flex alignItems="items-center">
                    <Text>BMI</Text>
                </Flex>
                <Flex
                    justifyContent="justify-start"
                    alignItems="items-baseline"
                >
                    <Metric color={getBmiColour(level)}>{level}</Metric>
                </Flex>
            </Card>
        );
    }

    render() {

        if (this.state.updated !== this.props.update)
        {
            this.setState({ updated: this.props.update });
        }

        const bodyFatPercent = calcBodyFatPercent(this.props.height, parseFloat(this.props.measurements.neck.toString()), parseFloat(this.props.measurements.waist.toString()), parseFloat(this.props.measurements.hips.toString()));
        const level = getBodyFatIndicator(this.props.age, bodyFatPercent);
        const bmi = calcBmi(this.props.height, this.props.measurements.weight);
        const bmiClass = getBmiClassification(bmi);
        return (
            <Grid centered>
                <Grid.Row columns={2} textAlign='center'>
                    <Grid.Column textAlign='center'>
                        {this.GetWeightMetric()}
                    </Grid.Column>
                    <Grid.Column textAlign='center' stretched={true}>
                        <img src={'body_fat_rating.PNG'}  />
                    </Grid.Column>
                    <Grid.Column textAlign='center' stretched={true}>
                        {this.GetBodyFatMetric(bodyFatPercent.toFixed(1))}
                    </Grid.Column>
                    <Grid.Column textAlign='center' stretched={true}>
                        {this.GetBodyTypeMetric(level)}
                    </Grid.Column>
                </Grid.Row>
            </Grid>);
    }
}

export default connect()(MeasurementsHeader);