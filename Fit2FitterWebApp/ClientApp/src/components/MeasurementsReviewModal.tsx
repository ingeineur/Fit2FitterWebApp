import * as React from 'react';
import { connect } from 'react-redux';
import { Button, Icon, Dimmer, Grid, Loader, Header, Segment } from 'semantic-ui-react';
import ChartistGraph from 'react-chartist';
import MeasurementsChat from './MeasurementsChat';
import SemanticDatepicker from 'react-semantic-ui-datepickers';
import { IMeasurements, IMeasurementDto, IGraphMeasurements, calcBodyFatPercent, getBodyFatIndicator, getColour, getBodyfatForeColour } from '../models/measurement';
import { AreaChart, LineChart } from "@tremor/react";

interface IProps {
    update: boolean;
    senderId: number;
    clientId: number;
    age: number;
    height: number;
    date: string;
}

interface IState {
    dirty: boolean;
    clientId: number;
    updated: boolean;
    graphs: IGraphMeasurements;
    weightLabel: string[];
    measurements: IMeasurements;
    measurementDtos: IMeasurementDto[];
    measurementDtosUpdated: boolean;
    allMeasurementDtos: IMeasurementDto[];
    allMeasurementDtosUpdated: boolean;
    selectedDate: Date;
    prevDate: Date;
    dateChanged: boolean,
    updateAllInfo: boolean,
}

interface IMeta {
    meta: string,
    value: number
}

class MeasurementsReviewModal extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);
        this.state = {
            dirty: false,
            clientId: 0,
            updated: false,
            graphs: {
                neck: [],
                upperArm: [],
                waist: [],
                hips: [],
                thigh: [],
                chest: [],
                weight: [],
                bodyFat:[]
            },
            weightLabel: [],
            measurements: { neck: 0.0, upperArm: 0.0, waist: 0.0, hips: 0.0, thigh: 0.0, chest: 0.0, weight: 0.0 },
            measurementDtos: [],
            measurementDtosUpdated: false,
            allMeasurementDtos: [],
            allMeasurementDtosUpdated: false,
            selectedDate: new Date(),
            prevDate: new Date(),
            dateChanged: false,
            updateAllInfo: true
        };
    }

    public componentDidMount() {
        var date = new Date(this.props.date);
        date.setDate(date.getDate() - 15);
        date.setHours(0, 0, 0, 0);
        this.setState({ selectedDate: date });

        fetch('api/client/' + this.props.clientId + '/measurements/closest?date=' + this.props.date)
            .then(response => response.json() as Promise<IMeasurementDto[]>)
            .then(data => this.setState({
                measurementDtos: data, measurementDtosUpdated: true, updateAllInfo: false
            })).catch(error => console.log(error));

        fetch('api/client/' + this.props.clientId + '/all/measurements?fromDate=' + date.toISOString() + '&date=' + this.props.date)
            .then(response => response.json() as Promise<IMeasurementDto[]>)
            .then(data => this.setState({
                allMeasurementDtos: data, allMeasurementDtosUpdated: true, updateAllInfo: false
            })).catch(error => console.log(error));

        this.setGraphValues();
    }

    getGraphData = (measureType: string) => {
        var chartData: any[] = [];
        var index: number = 0
        
        if (measureType === 'Neck') {
            this.state.weightLabel.forEach(m => {
                chartData.push({ date: m, Neck: this.state.graphs.neck[index] });
                index++;
            });
        }
        else if (measureType === 'UpperArm') {
            this.state.weightLabel.forEach(m => {
                chartData.push({ date: m, UpperArm: this.state.graphs.upperArm[index] });
                index++;
            });
        }
        else if (measureType === 'Waist') {
            this.state.weightLabel.forEach(m => {
                chartData.push({ date: m, Waist: this.state.graphs.waist[index] });
                index++;
            });
        }
        else if (measureType === 'Thigh') {
            this.state.weightLabel.forEach(m => {
                chartData.push({ date: m, Thigh: this.state.graphs.thigh[index] });
                index++;
            });
        }
        else if (measureType === 'Hips') {
            this.state.weightLabel.forEach(m => {
                chartData.push({ date: m, Hips: this.state.graphs.hips[index] });
                index++;
            });
        }
        else if (measureType === 'Chest') {
            this.state.weightLabel.forEach(m => {
                chartData.push({ date: m, Chest: this.state.graphs.chest[index] });
                index++;
            });
        }
        else if (measureType === 'BodyFat') {
            this.state.weightLabel.forEach(m => {
                chartData.push({ date: m, BodyFat: this.state.graphs.bodyFat[index] });
                index++;
            });
        }
        else {
            this.state.weightLabel.forEach(m => {
                chartData.push({ date: m, Weight: this.state.graphs.weight[index] });
                index++;
            });
        }

        return chartData;
    }

    setGraphValues = () => {
        while (this.state.weightLabel.length > 0) {
            this.state.weightLabel.pop()
        }

        this.state.graphs.chest = [];
        this.state.graphs.neck = [];
        this.state.graphs.upperArm = [];
        this.state.graphs.waist = [];
        this.state.graphs.hips = [];
        this.state.graphs.thigh = [];
        this.state.graphs.weight = [];
        this.state.graphs.bodyFat = [];

        var index: number = 0;
        var arr = this.state.allMeasurementDtos.sort((a: IMeasurementDto, b: IMeasurementDto) => {
            return (new Date(a.created)).getTime() - (new Date(b.created)).getTime();

        });

        arr.forEach(m => {
            this.state.weightLabel.push((new Date(m.created)).toLocaleDateString().slice(0, 5));
            
            this.state.graphs.chest.push(m.chest);
            this.state.graphs.neck.push(m.neck);
            this.state.graphs.upperArm.push(m.upperArm);
            this.state.graphs.waist.push(m.waist);
            this.state.graphs.hips.push(m.hips);
            this.state.graphs.thigh.push(m.thigh);
            this.state.graphs.weight.push(m.weight);

            const bodyFatPercent = (m.waist + m.hips - m.neck) / 2;
            this.state.graphs.bodyFat.push(bodyFatPercent);
            index++;
        });

        this.setState({ graphs: this.state.graphs, weightLabel: this.state.weightLabel });
    }

    setValuesFromDto = () => {
        if (this.state.measurementDtos.length > 0) {
            const measurement = this.state.measurementDtos[0];
            this.state.measurements.neck = measurement.neck;
            this.state.measurements.upperArm = measurement.upperArm;
            this.state.measurements.chest = measurement.chest;
            this.state.measurements.waist = measurement.waist;
            this.state.measurements.hips = measurement.hips;
            this.state.measurements.thigh = measurement.thigh;
            this.state.measurements.weight = measurement.weight;
            this.setState({ measurements: this.state.measurements });
            this.setState({ updated: !this.state.updated });
        }
        else {
            this.state.measurements.neck = 0;
            this.state.measurements.upperArm = 0;
            this.state.measurements.chest = 0;
            this.state.measurements.waist = 0;
            this.state.measurements.hips = 0;
            this.state.measurements.thigh = 0;
            this.state.measurements.weight = 0;
            this.setState({ measurements: this.state.measurements });
            this.setState({ updated: !this.state.updated });
        }

        this.setGraphValues();
    }

    handleDateChange = (event: any, field: any) => {
        var newDate = new Date(field['value']);
        var dayDiff = Math.abs((this.state.prevDate.getTime() - newDate.getTime()) / (1000 * 3600 * 24));
        if (dayDiff < 356) {
            this.setState({ prevDate: this.state.selectedDate });
            this.setState({ selectedDate: new Date(field['value']), dateChanged: true })
        }
    }

    getAllMeasurements = () => {
        fetch('api/client/' + this.props.clientId + '/all/measurements?fromDate=' + this.state.selectedDate.toISOString() + '&date=' + this.props.date)
            .then(response => response.json() as Promise<IMeasurementDto[]>)
            .then(data => this.setState({
                allMeasurementDtos: data, allMeasurementDtosUpdated: true, updateAllInfo: false
            })).catch(error => console.log(error));
    }

    isLoadingData = () => {
        if (!this.state.measurementDtosUpdated || !this.state.allMeasurementDtosUpdated) {
            return true;
        }

        return false;
    }

    getWeightProgress = (prevWeight: number, currWeight: number) => {
        var diff = currWeight - prevWeight;

        if (diff > 0.0) {
            return (<a>Weight Gain: {(diff).toFixed(2)}kg</a>)
        }

        return (<a>Weight Loss: {(diff).toFixed(2)}kg</a>)
    }

    render() {
        const bodyFatPercent = calcBodyFatPercent(this.props.height, parseFloat(this.state.measurements.neck.toString()), parseFloat(this.state.measurements.waist.toString()), parseFloat(this.state.measurements.hips.toString()));
        const level = getBodyFatIndicator(this.props.age, bodyFatPercent);

        var divLabelStyle1 = {
            color: getBodyfatForeColour(level),
            background: getColour(level)
        };

        var divLoaderStyle = {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        };

        if (this.state.dirty !== this.props.update) {
            this.setState({ dirty: this.props.update });
        }

        if (this.state.dateChanged === true) {
            this.setState({ dateChanged: false, allMeasurementDtosUpdated: false, updateAllInfo: true });
            this.getAllMeasurements();
        }

        var data2 = {
            labels: this.state.weightLabel,
            series: [this.state.graphs.weight]
        };

        var type = 'Line'

        var lineChartOptions = {
            reverseData: false,
            showArea: true
        }

        if (this.isLoadingData()) {
            return (<div style={divLoaderStyle}>
                <Dimmer active inverted>
                    <Loader content='Loading' />
                </Dimmer>
            </div>);
        }
        else if (!this.state.updateAllInfo) {
            this.setValuesFromDto();
            this.setState({ updateAllInfo: true, updated: !this.state.updated });
        }

        return (<div>
            <Grid centered>
                <a>Weight and Body Measurements Review</a>
                <Grid.Row columns={2}>
                    <Grid.Column verticalAlign='middle' floated='right' textAlign='right'>
                        <div>
                            <a>Measure From Date:</a>
                        </div>
                    </Grid.Column>
                    <Grid.Column verticalAlign='middle' floated='right' textAlign='right'>
                        <SemanticDatepicker value={this.state.selectedDate} date={new Date()} onChange={this.handleDateChange} showToday />
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column>
                        {this.getWeightProgress(this.state.graphs.weight[0], this.state.measurements.weight)}
                        <div>
                            <AreaChart
                                data={this.getGraphData('Weight')}
                                categories={["Weight"]}
                                dataKey="date"
                                height="h-72"
                                colors={["red"]}
                                marginTop="mt-4"
                            />
                        </div>
                        <a>Body Rating: </a><a style={divLabelStyle1}>{level}</a>
                        <div>
                            <AreaChart
                                data={this.getGraphData('BodyFat')}
                                categories={["BodyFat"]}
                                dataKey="date"
                                height="h-72"
                                colors={["purple"]}
                                marginTop="mt-4"
                            />
                        </div>
                        <a>Neck (in)</a>
                        <div>
                            <AreaChart
                                data={this.getGraphData('Neck')}
                                categories={["Neck"]}
                                dataKey="date"
                                height="h-72"
                                colors={["amber"]}
                                marginTop="mt-4"
                            />
                        </div>
                        <a>Waist (in)</a>
                        <div>
                            <AreaChart
                                data={this.getGraphData('Waist')}
                                categories={["Waist"]}
                                dataKey="date"
                                height="h-72"
                                colors={["fuchsia"]}
                                marginTop="mt-4"
                            />
                        </div>
                        <a>Hips (in)</a>
                        <div>
                            <AreaChart
                                data={this.getGraphData('Hips')}
                                categories={["Hips"]}
                                dataKey="date"
                                height="h-72"
                                colors={["emerald"]}
                                marginTop="mt-4"
                            />
                        </div>
                        <a>Chest (in)</a>
                        <div>
                            <AreaChart
                                data={this.getGraphData('Chest')}
                                categories={["Chest"]}
                                dataKey="date"
                                height="h-72"
                                colors={["indigo"]}
                                marginTop="mt-4"
                            />
                        </div>
                        <a>UpperArm (in)</a>
                        <div>
                            <AreaChart
                                data={this.getGraphData('UpperArm')}
                                categories={["UpperArm"]}
                                dataKey="date"
                                height="h-72"
                                colors={["lime"]}
                                marginTop="mt-4"
                            />
                        </div>
                        <a>Thigh (in)</a>
                        <div>
                            <AreaChart
                                data={this.getGraphData('Thigh')}
                                categories={["Thigh"]}
                                dataKey="date"
                                height="h-72"
                                colors={["red"]}
                                marginTop="mt-4"
                            />
                        </div>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column>
                        <Segment>
                            <Header as='h3'>
                                <Icon name='comment' />
                                <Header.Content>Comments</Header.Content>
                            </Header>
                            <MeasurementsChat clientId={this.props.senderId} toClientId={this.props.clientId} created={this.props.date} />
                        </Segment>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </div>);
    }
}

export default connect()(MeasurementsReviewModal);