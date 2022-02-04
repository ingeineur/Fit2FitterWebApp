import * as React from 'react';
import { connect } from 'react-redux';
import { Button, Icon, Dimmer, Grid, Loader, Header, Segment } from 'semantic-ui-react';
import ChartistGraph from 'react-chartist';
import MeasurementsChat from './MeasurementsChat';
import SemanticDatepicker from 'react-semantic-ui-datepickers';
import { IMeasurements, IMeasurementDto, IGraphMeasurements, calcBodyFatPercent, getBodyFatIndicator, getColour, getBodyfatForeColour } from '../models/measurement';

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
    graphsData: [IMeta[]];
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
            graphsData: [[]],
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
        if (measureType === 'Neck') {
            return { labels: this.state.weightLabel, series: [this.state.graphs.neck] };
        }

        if (measureType === 'UpperArm') {
            return { labels: this.state.weightLabel, series: [this.state.graphs.upperArm] };
        }

        if (measureType === 'Waist') {
            return { labels: this.state.weightLabel, series: [this.state.graphs.waist] };
        }

        if (measureType === 'Thigh') {
            return { labels: this.state.weightLabel, series: [this.state.graphs.thigh] };
        }

        if (measureType === 'Hips') {
            return { labels: this.state.weightLabel, series: [this.state.graphs.hips] };
        }

        if (measureType === 'Chest') {
            return { labels: this.state.weightLabel, series: [this.state.graphs.chest] };
        }

        if (measureType === 'BodyFat') {
            return { labels: this.state.weightLabel, series: [this.state.graphs.bodyFat] };
        }

        return { labels: this.state.weightLabel, series: [this.state.graphs.neck] };
    }

    setGraphValues = () => {
        while (this.state.graphsData.length > 0) {
            this.state.graphsData.pop()
        }

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
            var values: IMeta[] = [];
            if (index === 0 || index === arr.length - 1) {
                this.state.weightLabel.push((new Date(m.created)).toLocaleDateString().slice(0, 5));
            }
            else {
                this.state.weightLabel.push('');
            }
            
            this.state.graphs.chest.push(m.chest);
            values.push({ 'meta': 'chest', 'value': m.chest });
            this.state.graphs.neck.push(m.neck);
            values.push({ 'meta': 'chest', 'value': m.chest });
            this.state.graphs.upperArm.push(m.upperArm);
            values.push({ 'meta': 'upperArm', 'value': m.upperArm });
            this.state.graphs.waist.push(m.waist);
            values.push({ 'meta': 'waist', 'value': m.waist });
            this.state.graphs.hips.push(m.hips);
            values.push({ 'meta': 'hips', 'value': m.hips });
            this.state.graphs.thigh.push(m.thigh);
            values.push({ 'meta': 'thigh', 'value': m.thigh });
            this.state.graphs.weight.push(m.weight);

            const bodyFatPercent = (m.waist + m.hips - m.neck) / 2;
            this.state.graphs.bodyFat.push(bodyFatPercent);

            this.state.graphsData.push(values);
            index++;
        });

        this.setState({ graphs: this.state.graphs, graphsData: this.state.graphsData, weightLabel: this.state.weightLabel });
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
                            <ChartistGraph data={data2} type={type} options={lineChartOptions} />
                        </div>
                        <a>Body Fat Type: </a><a style={divLabelStyle1}>{level}</a>
                        <div>
                            <ChartistGraph data={this.getGraphData('BodyFat')} type={type} options={lineChartOptions} />
                        </div>
                        <a>Neck (in)</a>
                        <div>
                            <ChartistGraph data={this.getGraphData('Neck')} type={type} options={lineChartOptions} />
                        </div>
                        <a>Waist (in)</a>
                        <div>
                            <ChartistGraph data={this.getGraphData('Waist')} type={type} options={lineChartOptions} />
                        </div>
                        <a>Hips (in)</a>
                        <div>
                            <ChartistGraph data={this.getGraphData('Hips')} type={type} options={lineChartOptions} />
                        </div>
                        <a>Chest (in)</a>
                        <div>
                            <ChartistGraph data={this.getGraphData('Chest')} type={type} options={lineChartOptions} />
                        </div>
                        <a>UpperArm (in)</a>
                        <div>
                            <ChartistGraph data={this.getGraphData('UpperArm')} type={type} options={lineChartOptions} />
                        </div>
                        <a>Thigh (in)</a>
                        <div>
                            <ChartistGraph data={this.getGraphData('Thigh')} type={type} options={lineChartOptions} />
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