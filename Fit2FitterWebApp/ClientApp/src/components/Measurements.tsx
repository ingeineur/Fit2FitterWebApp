import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { Redirect } from 'react-router-dom';
import { Button, Segment, Grid, Menu, Label, Input, Icon, Dropdown, Modal } from 'semantic-ui-react'
import { ApplicationState } from '../store';
import * as LoginStore from '../store/Login';
import SemanticDatepicker from 'react-semantic-ui-datepickers';
import 'react-semantic-ui-datepickers/dist/react-semantic-ui-datepickers.css';
import MeasurementsTable from './MeasurementsTable'
import MeasurementsHeader from './MeasurementsHeader';
import MeasurementsReviewModal from './MeasurementsReviewModal'
import ChartistGraph from 'react-chartist';

interface IProps {
}

interface IState {
    username: string;
    password: string;
    activeItem: string;
    selectedDate: Date;
    prevDate: Date;
    macroGuides: IMacroGuides;
    measurements: IMeasurements;
    measurementDtos: IMeasurementDto[];
    allMeasurementDtos: IMeasurementDto[];
    graphs: IGraphMeasurements;
    graphsData: [IMeta[]];
    weightLabel: string[];
    clients: IClient[];
    macrosPlans: IMacrosPlan[];
    targetWeight: number;
    age: number;
    updated: boolean;
    apiUpdate: boolean;
    savingStatus: string;
    dateChanged: boolean; 
    measureType: string;
    openReview: boolean;
}

interface IMacroGuides {
    carb: number;
    protein: number;
    fat: number;
    veg: number;
    bodyFat: number;
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

interface IMacrosPlan {
    id: number,
    height: number,
    weight: number,
    targetWeight: number,
    macroType: string;
    activityLevel: string;
    carbPercent: number,
    proteinPercent: number,
    fatPercent: number,
    updated: string;
    created: string;
    clientId: number;
}

interface IClient {
    id: number,
    lastName: string;
    firstName: string;
    address: string;
    city: string;
    age: number;
    created: string;
}

const measureType = [
    {
        key: 'Neck',
        text: 'Neck',
        value: 'Neck'
    },
    {
        key: 'UpperArm',
        text: 'UpperArm',
        value: 'UpperArm'
    },
    {
        key: 'Waist',
        text: 'Waist',
        value: 'Waist'
    },
    {
        key: 'Hips',
        text: 'Hips',
        value: 'Hips'
    },
    {
        key: 'Thigh',
        text: 'Thigh',
        value: 'Thigh'
    },
    {
        key: 'Chest',
        text: 'Chest',
        value: 'Chest'
    }
];

// At runtime, Redux will merge together...
type LoginProps =
    IProps
    & LoginStore.LoginState // ... state we've requested from the Redux store
    & typeof LoginStore.actionCreators // ... plus action creators we've requested
    & RouteComponentProps<{ username: string, password: string }>; // ... plus incoming routing parameters

class Measurements extends React.Component<LoginProps, IState> {

    public componentDidMount() {
        this.props.getLogin();
        var date = new Date();
        date.setHours(0, 0, 0, 0);
        this.setState({ selectedDate: date, prevDate: date });

        if (this.props.logins.length > 0) {

            fetch('api/client?clientId=' + this.props.logins[0].clientId)
                .then(response => response.json() as Promise<IClient[]>)
                .then(data => this.setState({
                    clients: data, apiUpdate: true
                })).catch(error => console.log(error));

            fetch('api/client/' + this.props.logins[0].clientId + '/measurements/closest?date=' + (date).toISOString())
                .then(response => response.json() as Promise<IMeasurementDto[]>)
                .then(data => this.setState({
                    measurementDtos: data, apiUpdate: true
                })).catch(error => console.log(error));

            fetch('api/client/' + this.props.logins[0].clientId + '/all/measurements?date=' + (date).toISOString())
                .then(response => response.json() as Promise<IMeasurementDto[]>)
                .then(data => this.setState({
                    allMeasurementDtos: data, apiUpdate: true
                })).catch(error => console.log(error));

            fetch('api/client/' + this.props.logins[0].clientId + '/macrosplan')
                .then(response => response.json() as Promise<IMacrosPlan[]>)
                .then(data => this.setState({
                    macrosPlans: data, apiUpdate: true
                })).catch(error => console.log(error));
        }
    }

    onSubmit = () => {
        this.setState({ username: '', password: '' });
    }

    updateInput = (event: any) => {
        this.setState({ username: event.target.value });
    }

    updateInput2 = (event: any) => {
        this.setState({ password: event.target.value });
    }

    getComponent = () => {
        if (this.state.activeItem == 'Body') {
            return (<MeasurementsTable type='Body' measurements={this.state.measurements} updateMeasurements={this.updateMeasurements} update={this.state.updated} />);
        }
    }

    updateMeasurements = (input: IMeasurements) => {
        this.setState({ measurements: { neck: input.neck, upperArm: input.upperArm, waist: input.waist, hips: input.hips, thigh: input.thigh, chest: input.chest, weight: input.weight } });
        this.setState({ updated: !this.state.updated, savingStatus: 'Not Saved' });
    }

    constructor(props: LoginProps) {
        super(props);
        this.updateMeasurements = this.updateMeasurements.bind(this);
        this.state = {
            username: '', password: '',
            activeItem: 'Body',
            selectedDate: new Date(),
            prevDate: new Date(),
            macroGuides: { carb: 0, protein: 0, fat: 0, veg: 0, bodyFat: 0 },
            measurements: { neck: 0.0, upperArm:0.0, waist: 0.0, hips: 0.0, thigh: 0.0, chest: 0.0, weight: 0.0 },
            measurementDtos: [],
            allMeasurementDtos: [],
            clients: [],
            macrosPlans: [],
            updated: false,
            apiUpdate: false,
            savingStatus: 'saved',
            dateChanged: false,
            age: 0,
            targetWeight: 0,
            graphs: {
                neck: [],
                upperArm: [],
                waist: [],
                hips: [],
                thigh: [],
                chest: [],
                weight: []
            },
            graphsData: [[]],
            weightLabel: [],
            measureType: 'Neck',
            openReview: false
        };
    }

    handleItemClick = (e: any, { name }: any) => this.setState({ activeItem: name })

    handleDateChange = (event: any, field: any) => {
        var newDate = new Date(field['value']);
        //console.log('1 --' + Math.abs((this.state.selectedDate.getTime() - newDate.getTime()) / (1000 * 3600 * 24)));
        //console.log('2 --' + Math.abs((this.state.prevDate.getTime() - newDate.getTime()) / (1000 * 3600 * 24)));
        var dayDiff = Math.abs((this.state.prevDate.getTime() - newDate.getTime()) / (1000 * 3600 * 24));
        if (dayDiff < 356) {
            this.setState({ prevDate: this.state.selectedDate });
            this.setState({ selectedDate: new Date(field['value']), measurementDtos: [], dateChanged: true })
        }
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

        var index: number = 0;
        var arr = this.state.allMeasurementDtos.sort((a: IMeasurementDto, b: IMeasurementDto) => {
            return (new Date(a.created)).getTime() - (new Date(b.created)).getTime();

        });
        arr.forEach(m => {
            var values: IMeta[] = [];
            this.state.weightLabel.push((new Date(m.created)).toLocaleDateString().slice(0,5));
            this.state.graphs.chest.push(m.chest);
            values.push({ 'meta': 'chest', 'value': m.chest});
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
            this.state.graphsData.push(values);
            index++;
        });

        this.setState({ graphs: this.state.graphs, graphsData: this.state.graphsData, weightLabel: this.state.weightLabel });
    }

    setValuesFromDto = () => {
        if (this.state.clients.length > 0) {
            const client = this.state.clients[0];
            this.setState({ age: client.age });
        }

        if (this.state.macrosPlans.length > 0) {
            const plan = this.state.macrosPlans[0];
            this.setState({ targetWeight: plan.targetWeight });
        }

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

    onCancel = () => {
        this.setValuesFromDto();
    }

    onSave = () => {
        this.setState({ savingStatus: 'Saving in progress' })
        var fetchStr = 'api/client/measurement?date=' + this.state.selectedDate.toISOString();
        if (this.state.measurementDtos.length < 1) {
            this.state.measurementDtos.push({
                id: 0,
                neck: parseFloat(this.state.measurements.neck.toString()),
                upperArm: parseFloat(this.state.measurements.upperArm.toString()),
                waist: parseFloat(this.state.measurements.waist.toString()),
                hips: parseFloat(this.state.measurements.hips.toString()),
                thigh: parseFloat(this.state.measurements.thigh.toString()),
                chest: parseFloat(this.state.measurements.chest.toString()),
                weight: parseFloat(this.state.measurements.weight.toString()),
                bodyFat: 0,
                updated: (new Date()).toISOString(),
                created: this.state.selectedDate.toISOString(),
                clientId: this.props.logins[0].clientId
            })
            this.setState({ measurementDtos: this.state.measurementDtos });
        }

        fetch(fetchStr, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: 0,
                neck: parseFloat(this.state.measurements.neck.toString()),
                upperArm: parseFloat(this.state.measurements.upperArm.toString()),
                waist: parseFloat(this.state.measurements.waist.toString()),
                hips: parseFloat(this.state.measurements.hips.toString()),
                thigh: parseFloat(this.state.measurements.thigh.toString()),
                chest: parseFloat(this.state.measurements.chest.toString()),
                weight: parseFloat(this.state.measurements.weight.toString()),
                bodyFat: 0,
                updated: new Date(),
                created: this.state.selectedDate.toISOString(),
                clientId: this.props.logins[0].clientId,
            })
        }).then(response => response.json()).then(data => this.setState({ savingStatus: 'Saved' })).catch(error => console.log('put macros ---------->' + error));

        setTimeout(() => {
            this.logMeasurements();
        }, 2000);
    }

    logMeasurements = () => {
        var fetchStr = 'api/tracker/comment?date=' + this.state.selectedDate.toISOString();
        fetch(fetchStr, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: 0,
                measurementRef: 1,
                mealsRef: 0,
                activitiesRef: 0,
                readStatus: false,
                message: 'Log measurements for this week',
                created: this.state.selectedDate.toISOString(),
                updated: (new Date()).toISOString(),
                fromId: this.props.logins[0].clientId,
                clientId: 2,
            })
        }).then(response => response.json()).then(data => this.setState({ updated: !this.state.updated })).catch(error => console.log('put macros ---------->' + error));
    }

    getColour = () => {
        if (this.state.savingStatus === 'Not Saved') {
            return 'red';
        }

        return 'green';
    }

    setMeasureType = (event: any, data: any) => {
        this.setState({ updated: true, measureType: data['value'] });
    }

    getGraphData = () => {
        if (this.state.measureType === 'Neck') {
            return this.state.graphs.neck;
        }

        if (this.state.measureType === 'UpperArm') {
            return this.state.graphs.upperArm;
        }

        if (this.state.measureType === 'Waist') {
            return this.state.graphs.waist;
        }

        if (this.state.measureType === 'Thigh') {
            return this.state.graphs.thigh;
        }

        if (this.state.measureType === 'Hips') {
            return this.state.graphs.hips;
        }

        if (this.state.measureType === 'Chest') {
            return this.state.graphs.chest;
        }
    }

    handleOpen = (open: boolean) => {
        this.setState({ openReview: open });
    }

    render() {
        var data = {
            labels: this.state.weightLabel,
            series: [this.getGraphData()]
        };

        var type = 'Line'

        var data2 = {
            labels: this.state.weightLabel,
            series: [this.state.graphs.weight]
        };

        var type2 = 'Line'

        var divLabelStyle = {
            color: '#fffafa',
            backgroundColor: this.getColour()
        };

        const activeItem = this.state.activeItem;
        if (this.props.logins.length > 0) {
            if (this.state.dateChanged === true) {
                this.setState({ dateChanged: false });
                if (this.props.logins.length > 0) {
                    fetch('api/client/' + this.props.logins[0].clientId + '/measurements/closest?date=' + this.state.selectedDate.toISOString())
                        .then(response => response.json() as Promise<IMeasurementDto[]>)
                        .then(data => this.setState({
                            measurementDtos: data, apiUpdate: true
                        })).catch(error => console.log(error));

                    fetch('api/client/' + this.props.logins[0].clientId + '/all/measurements?date=' + this.state.selectedDate.toISOString())
                        .then(response => response.json() as Promise<IMeasurementDto[]>)
                        .then(data => this.setState({
                            allMeasurementDtos: data, apiUpdate: true
                        })).catch(error => console.log(error));
                }
            }

            if (this.state.apiUpdate === true) {
                this.setValuesFromDto();
            }

        return (
            <div>
                <Grid centered>
                    <Grid.Row columns={2}>
                        <Grid.Column verticalAlign='middle' floated='left' textAlign='left'>
                            <Label size='large' as='a' color='pink' basic circular>Weekly Measurements Tracker</Label>
                        </Grid.Column>
                        <Grid.Column verticalAlign='middle' floated='right' textAlign='right'>
                            <SemanticDatepicker value={this.state.selectedDate} date={new Date()} onChange={this.handleDateChange} showToday />
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column>
                            <Segment textAlign='center'>
                                <MeasurementsHeader targetWeight={this.state.targetWeight} measurements={this.state.measurements} age={this.state.age} update={this.state.updated} />
                            </Segment>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column width={16}>
                            <Menu attached='top' tabular compact>
                                <Menu.Item
                                    name='Body'
                                    active={activeItem === 'Body'}
                                    onClick={this.handleItemClick}
                                />
                            </Menu>

                            <Segment textAlign='center' attached='bottom'>
                                {this.getComponent()}
                            </Segment>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column verticalAlign='middle' width={16} textAlign='center' floated='left'>
                            <div style={divLabelStyle}>
                                <a>{this.state.savingStatus}</a>
                            </div>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row columns={4}>
                        <Grid.Column width={4} textAlign='left' floated='left'>
                            <Button floated='left' size='tiny' onClick={this.onCancel} secondary>Cancel</Button>
                        </Grid.Column>
                        <Grid.Column width={4} textAlign='left' floated='left'>
                            <Button floated='left' size='tiny' onClick={this.onSave} primary>Save</Button>
                        </Grid.Column>
                        <Grid.Column verticalAlign='middle' width={2} textAlign='left' floated='left'>
                        </Grid.Column>
                        <Grid.Column width={6} textAlign='right' floated='right'>
                            <Modal
                                open={this.state.openReview}
                                onClose={() => this.handleOpen(false)}
                                onOpen={() => this.handleOpen(true)}
                                trigger={<Button size='tiny' primary>Review Progress</Button>}>
                                <Modal.Header>Body assessments until {this.state.selectedDate.toLocaleDateString()}</Modal.Header>
                                <Modal.Content scrolling>
                                    <Modal.Description>
                                        <MeasurementsReviewModal date={this.state.selectedDate.toISOString()} age={this.state.age} clientId={this.props.logins[0].clientId} update={this.state.updated} />
                                    </Modal.Description>
                                </Modal.Content>
                                <Modal.Actions>
                                    <Button size='tiny' onClick={() => this.handleOpen(false)} primary>
                                        Close <Icon name='chevron right' />
                                    </Button>
                                </Modal.Actions>
                            </Modal>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </div>);
        }
        return (<Redirect to="/" />);
    }

    private getLoginCredentials = () => {
        this.props.requestLogins(this.state.username, this.state.password);
    }

    private clearCredentials = () => {
        this.props.requestLogout(this.state.username, this.state.password);
    }
}

//export default connect()(Home);
export default connect(
    (state: ApplicationState) => state.logins, // Selects which state properties are merged into the component's props
    LoginStore.actionCreators // Selects which action creators are merged into the component's props
)(Measurements as any);