import * as React from 'react';
import { connect } from 'react-redux';
import { Button, Icon, Input, Grid, Message, Header, Segment } from 'semantic-ui-react';
import ChartistGraph from 'react-chartist';
import MeasurementsChat from './MeasurementsChat';

interface IProps {
    update: boolean;
    senderId: number;
    clientId: number;
    age: number;
    date: string;
}

interface IState {
    dirty: boolean;
    clientId: number;
    apiUpdate: boolean;
    updated: boolean;
    graphs: IGraphMeasurements;
    graphsData: [IMeta[]];
    weightLabel: string[];
    measurements: IMeasurements;
    measurementDtos: IMeasurementDto[];
    allMeasurementDtos: IMeasurementDto[];
}

interface IMeta {
    meta: string,
    value: number
}

interface IMeasurements {
    neck: number;
    upperArm: number;
    waist: number;
    hips: number;
    thigh: number;
    chest: number;
    weight: number;
}

interface IGraphMeasurements {
    neck: number[];
    upperArm: number[];
    waist: number[];
    hips: number[];
    thigh: number[];
    chest: number[];
    weight: number[];
    bodyFat: number[];
}

interface IMeasurementDto {
    id: number;
    neck: number;
    upperArm: number;
    waist: number;
    hips: number;
    thigh: number;
    chest: number;
    weight: number;
    bodyFat: number;
    updated: string;
    created: string;
    clientId: number;
}

class MeasurementsReviewModal extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);
        this.state = {
            dirty: false,
            clientId: 0,
            apiUpdate: false,
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
            allMeasurementDtos: []
        };
    }

    public componentDidMount() {
        fetch('api/client/' + this.props.clientId + '/measurements/closest?date=' + this.props.date)
            .then(response => response.json() as Promise<IMeasurementDto[]>)
            .then(data => this.setState({
                measurementDtos: data, apiUpdate: true
            })).catch(error => console.log(error));

        fetch('api/client/' + this.props.clientId + '/all/measurements?date=' + this.props.date)
            .then(response => response.json() as Promise<IMeasurementDto[]>)
            .then(data => this.setState({
                allMeasurementDtos: data, apiUpdate: true
            })).catch(error => console.log(error));

        this.setGraphValues();
    }

    getBodyFatIndicator = (age: number, bodyFat: number) => {
        if (age <= 20) {
            if (11.3 <= bodyFat && bodyFat <= 15.7) {
                return 'LEAN';
            }
            if (15.7 < bodyFat && bodyFat <= 21.5) {
                return 'IDEAL';
            }
            if (21.5 < bodyFat && bodyFat <= 29.0) {
                return 'AVERAGE';
            }
            if (29.0 < bodyFat && bodyFat <= 34.6) {
                return 'ABOVE AVERAGE';
            }
        }
        if (21 <= age && age <= 25) {
            if (11.9 <= bodyFat && bodyFat <= 18.4) {
                return 'LEAN';
            }
            if (18.4 < bodyFat && bodyFat <= 23.8) {
                return 'IDEAL';
            }
            if (23.8 < bodyFat && bodyFat <= 29.6) {
                return 'AVERAGE';
            }
            if (29.6 < bodyFat && bodyFat <= 35.2) {
                return 'ABOVE AVERAGE';
            }
        }
        if (26 <= age && age <= 30) {
            if (12.5 <= bodyFat && bodyFat <= 19.0) {
                return 'LEAN';
            }
            if (19.0 < bodyFat && bodyFat <= 24.5) {
                return 'IDEAL';
            }
            if (24.5 < bodyFat && bodyFat <= 31.5) {
                return 'AVERAGE';
            }
            if (31.5 < bodyFat && bodyFat <= 35.8) {
                return 'ABOVE AVERAGE';
            }
        }
        if (31 <= age && age <= 35) {
            if (13.2 <= bodyFat && bodyFat <= 19.6) {
                return 'LEAN';
            }
            if (19.6 < bodyFat && bodyFat <= 25.1) {
                return 'IDEAL';
            }
            if (25.1 < bodyFat && bodyFat <= 32.1) {
                return 'AVERAGE';
            }
            if (32.1 < bodyFat && bodyFat <= 36.4) {
                return 'ABOVE AVERAGE';
            }
        }
        if (36 <= age && age <= 40) {
            if (13.8 <= bodyFat && bodyFat <= 22.2) {
                return 'LEAN';
            }
            if (22.2 < bodyFat && bodyFat <= 27.3) {
                return 'IDEAL';
            }
            if (27.3 < bodyFat && bodyFat <= 32.7) {
                return 'AVERAGE';
            }
            if (32.7 < bodyFat && bodyFat <= 37.0) {
                return 'ABOVE AVERAGE';
            }
        }
        if (41 <= age && age <= 45) {
            if (14.4 <= bodyFat && bodyFat <= 22.8) {
                return 'LEAN';
            }
            if (22.8 < bodyFat && bodyFat <= 27.9) {
                return 'IDEAL';
            }
            if (27.9 < bodyFat && bodyFat <= 34.4) {
                return 'AVERAGE';
            }
            if (34.4 < bodyFat && bodyFat <= 37.7) {
                return 'ABOVE AVERAGE';
            }
        }
        if (46 <= age && age <= 50) {
            if (15.0 <= bodyFat && bodyFat <= 23.4) {
                return 'LEAN';
            }
            if (23.4 < bodyFat && bodyFat <= 28.6) {
                return 'IDEAL';
            }
            if (28.6 < bodyFat && bodyFat <= 35.0) {
                return 'AVERAGE';
            }
            if (35.0 < bodyFat && bodyFat <= 38.3) {
                return 'ABOVE AVERAGE';
            }
        }
        if (51 <= age && age <= 55) {
            if (15.6 <= bodyFat && bodyFat <= 24.0) {
                return 'LEAN';
            }
            if (24.0 < bodyFat && bodyFat <= 29.2) {
                return 'IDEAL';
            }
            if (29.2 < bodyFat && bodyFat <= 35.6) {
                return 'AVERAGE';
            }
            if (35.6 < bodyFat && bodyFat <= 38.9) {
                return 'ABOVE AVERAGE';
            }
        }
        if (56 <= age) {
            if (16.3 <= bodyFat && bodyFat <= 24.6) {
                return 'LEAN';
            }
            if (24.6 < bodyFat && bodyFat <= 29.8) {
                return 'IDEAL';
            }
            if (29.8 < bodyFat && bodyFat <= 37.2) {
                return 'AVERAGE';
            }
            if (37.2 < bodyFat && bodyFat <= 39.5) {
                return 'ABOVE AVERAGE';
            }
        }

        return 'AVERAGE';
    }

    getColour = (level: string) => {
        if (level === 'LEAN') {
            return 'blue';
        }

        if (level === 'IDEAL') {
            return 'green';
        }

        if (level === 'AVERAGE') {
            return 'yellow';
        }

        return 'red';
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
            this.setState({ apiUpdate: false, updated: !this.state.updated });
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
            this.setState({ apiUpdate: false, updated: !this.state.updated });
        }

        this.setGraphValues();
    }

    render() {
        const bodyFatPercent = (((parseFloat(this.state.measurements.waist.toString()) + parseFloat(this.state.measurements.hips.toString())) - parseFloat(this.state.measurements.neck.toString())) / 2);
        const level = this.getBodyFatIndicator(this.props.age, bodyFatPercent);

        var divLabelStyle1 = {
            color: 'black',
            background: this.getColour(level)
        };

        if (this.state.dirty !== this.props.update) {
            this.setState({ dirty: this.props.update });
        }

        if (this.state.apiUpdate === true) {
            this.setState({ apiUpdate: false });
            this.setValuesFromDto();
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

        return (<div>
            <Grid centered>
                <a>Weight and Body Measurements Review</a>
                <Grid.Row>
                    <Grid.Column>
                        <a>Weight Progress: : {(this.state.graphs.weight[0] - this.state.measurements.weight).toFixed(2)}kg from start weight</a>
                        <div>
                            <ChartistGraph data={data2} type={type} options={lineChartOptions} />
                        </div>
                        <a>Body Fat: </a><a style={divLabelStyle1}>{level}</a>
                        <div>
                            <ChartistGraph data={this.getGraphData('BodyFat')} type={type} options={lineChartOptions} />
                        </div>
                        <a>Neck</a>
                        <div>
                            <ChartistGraph data={this.getGraphData('Neck')} type={type} options={lineChartOptions} />
                        </div>
                        <a>Waist</a>
                        <div>
                            <ChartistGraph data={this.getGraphData('Waist')} type={type} options={lineChartOptions} />
                        </div>
                        <a>Hips</a>
                        <div>
                            <ChartistGraph data={this.getGraphData('Hips')} type={type} options={lineChartOptions} />
                        </div>
                        <a>Chest</a>
                        <div>
                            <ChartistGraph data={this.getGraphData('Chest')} type={type} options={lineChartOptions} />
                        </div>
                        <a>UpperArm</a>
                        <div>
                            <ChartistGraph data={this.getGraphData('UpperArm')} type={type} options={lineChartOptions} />
                        </div>
                        <a>Thigh</a>
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