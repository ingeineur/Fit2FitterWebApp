import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { Redirect } from 'react-router-dom';
import { Button, Segment, Grid, Menu, Label, Input, Icon, Progress, Modal, Loader, Dimmer, Divider } from 'semantic-ui-react'
import { ApplicationState } from '../store';
import * as LoginStore from '../store/Login';
import SemanticDatepicker from 'react-semantic-ui-datepickers';
import 'react-semantic-ui-datepickers/dist/react-semantic-ui-datepickers.css';
import MeasurementsTable from './MeasurementsTable'
import Measurements3DViewer from './Measurements3DViewer'
import MeasurementsHeader from './MeasurementsHeader';
import MeasurementsReviewModal from './MeasurementsReviewModal'
import AppsMenu from './AppMenus';
import { IClientDto } from '../models/clients';
import { IMeasurements, IMeasurementDto, IGraphMeasurements } from '../models/measurement';
import { IMacroGuides, IMacrosPlan } from '../models/macros';

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
    currentMeasurements: IMeasurements;
    measurementDtos: IMeasurementDto[];
    currentMeasurementDtos: IMeasurementDto[];
    measurementDtosUpdated: boolean;
    graphs: IGraphMeasurements;
    graphsData: [IMeta[]];
    weightLabel: string[];
    clients: IClientDto[];
    clientsUpdated: boolean;
    macrosPlans: IMacrosPlan[];
    macrosPlansUpdated: boolean;
    targetWeight: number;
    age: number;
    updated: boolean;
    savingStatus: string;
    dateChanged: boolean; 
    measureType: string;
    openReview: boolean;
    updateAllInfo: boolean;
}

interface IMeta {
    meta: string,
    value: number
}

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
                .then(response => response.json() as Promise<IClientDto[]>)
                .then(data => this.setState({
                    clients: data, clientsUpdated: true
                })).catch(error => console.log(error));

            fetch('api/client/' + this.props.logins[0].clientId + '/measurements/closest?date=' + (date).toISOString())
                .then(response => response.json() as Promise<IMeasurementDto[]>)
                .then(data => this.setState({
                    measurementDtos: data, currentMeasurementDtos: data, measurementDtosUpdated: true
                })).catch(error => console.log(error));

            fetch('api/client/' + this.props.logins[0].clientId + '/macrosplan')
                .then(response => response.json() as Promise<IMacrosPlan[]>)
                .then(data => this.setState({
                    macrosPlans: data, macrosPlansUpdated: true
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
        else if (this.state.activeItem == '3DScanner') {
            return (<Measurements3DViewer date={this.state.selectedDate.toDateString()} type='3DScanner' height={this.getHeight()} measurements={this.state.measurements} currentMeasurements={this.state.currentMeasurements} updateMeasurements={this.updateMeasurements} update={this.state.updated} />);
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
            measurements: { neck: 0.0, upperArm: 0.0, waist: 0.0, hips: 0.0, thigh: 0.0, chest: 0.0, weight: 0.0 },
            currentMeasurements: { neck: 0.0, upperArm: 0.0, waist: 0.0, hips: 0.0, thigh: 0.0, chest: 0.0, weight: 0.0 },
            measurementDtos: [],
            currentMeasurementDtos: [],
            measurementDtosUpdated: false,
            clients: [],
            clientsUpdated: false,
            macrosPlans: [],
            macrosPlansUpdated: false,
            updated: false,
            savingStatus: 'Loading',
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
                weight: [],
                bodyFat: []
            },
            graphsData: [[]],
            weightLabel: [],
            measureType: 'Neck',
            openReview: false,
            updateAllInfo: false
        };
    }

    handleItemClick = (e: any, { name }: any) => this.setState({ activeItem: name })

    handleDateChange = (event: any, field: any) => {
        var newDate = new Date(field['value']);
        var dayDiff = Math.abs((this.state.prevDate.getTime() - newDate.getTime()) / (1000 * 3600 * 24));
        if (dayDiff < 356) {
            this.setState({ prevDate: this.state.selectedDate });
            this.setState({ selectedDate: new Date(field['value']), measurementDtos: [], dateChanged: true })
        }
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

        if (this.state.currentMeasurementDtos.length > 0) {
            const measurement = this.state.currentMeasurementDtos[0];
            this.state.currentMeasurements.neck = measurement.neck;
            this.state.currentMeasurements.upperArm = measurement.upperArm;
            this.state.currentMeasurements.chest = measurement.chest;
            this.state.currentMeasurements.waist = measurement.waist;
            this.state.currentMeasurements.hips = measurement.hips;
            this.state.currentMeasurements.thigh = measurement.thigh;
            this.state.currentMeasurements.weight = measurement.weight;
            this.setState({ currentMeasurements: this.state.currentMeasurements });
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
            this.setState({ measurements: this.state.measurements, updated: !this.state.updated, savingStatus: 'Info Updated' });
        }
        else {
            this.state.measurements.neck = 0;
            this.state.measurements.upperArm = 0;
            this.state.measurements.chest = 0;
            this.state.measurements.waist = 0;
            this.state.measurements.hips = 0;
            this.state.measurements.thigh = 0;
            this.state.measurements.weight = 0;
            this.setState({ measurements: this.state.measurements, updated: !this.state.updated, savingStatus: 'Info Updated' });
        }
    }

    onCancel = () => {
        this.setValuesFromDto();
    }

    onSave = () => {
        this.setState({ savingStatus: 'Saving in progress', measurementDtosUpdated: false })
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
        }

        var fetchStr = 'api/client/measurement?date=' + this.state.selectedDate.toISOString();
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
        }).then(response => response.json()).then(data => {
            this.setState({ savingStatus: 'Saved', measurementDtos: this.state.measurementDtos, measurementDtosUpdated: true })
            this.logMeasurements();
        }).catch(error => console.log('put macros ---------->' + error));
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

    showProgressBar = () => {
        if (this.state.savingStatus == 'Saving in progress') {
            return (<Progress inverted color='green' percent={100} active={this.state.savingStatus === 'Saving in progress'} />);
        }
    }

    isLoadingData = () => {
        if (!this.state.clientsUpdated || !this.state.macrosPlansUpdated ||
            !this.state.measurementDtosUpdated) {
            return true;
        }

        return false;
    }

    getSaveIcon = () => {
        if (this.state.savingStatus === 'Not Saved') {
            return 'edit outline';
        }

        return 'save';
    }

    getHeight = () => {
        if (this.state.macrosPlans.length > 0) {
            return this.state.macrosPlans[0].height;
        }

        return 0;
    }

    render() {
        var divLabelStyle = {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: '#fffafa',
            backgroundColor: this.getColour()
        };

        var divLoaderStyle = {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        };

        const activeItem = this.state.activeItem;
        if (this.props.logins.length > 0) {
            if (this.state.dateChanged === true) {
                this.setState({ dateChanged: false, measurementDtosUpdated: false });

                // fetch measurements
                fetch('api/client/' + this.props.logins[0].clientId + '/measurements/closest?date=' + this.state.selectedDate.toISOString())
                    .then(response => response.json() as Promise<IMeasurementDto[]>)
                    .then(data => this.setState({
                        measurementDtos: data, measurementDtosUpdated: true, updateAllInfo: false
                    })).catch(error => console.log(error));
            }

            if (this.isLoadingData()) {
                return (<div style={divLoaderStyle}>
                    <Dimmer active inverted>
                        <Loader content={this.state.savingStatus} />
                    </Dimmer>
                </div>);
            }
            else if (!this.state.updateAllInfo) {
                this.setValuesFromDto();
                this.setState({ updateAllInfo: true, updated: !this.state.updated, savingStatus: 'Info Updated' });
            }

        return (
            <div>
                <Grid centered>
                    <Grid.Row>
                        <Grid.Column width={16}>
                            <AppsMenu activeItem='Body' logins={this.props.logins} clientDtos={this.state.clients} />
                        </Grid.Column>
                        <Grid.Column width={16}>
                            <Segment attached='top'>
                                <div style={divLoaderStyle}>
                                    <SemanticDatepicker value={this.state.selectedDate} date={new Date()} onChange={this.handleDateChange} showToday />
                                </div>
                                <Label corner='right' color={this.getColour()} icon><Icon name={this.getSaveIcon()} /></Label>
                            </Segment>
                            <Segment textAlign='center' attached='bottom'>
                                <MeasurementsHeader height={this.getHeight()} targetWeight={this.state.targetWeight} measurements={this.state.measurements} age={this.state.age} update={this.state.updated} />
                            </Segment>
                        </Grid.Column>
                        <Grid.Column width={16}>
                            <Menu attached='top' pointing compact>
                                <Menu.Item
                                    name='Body'
                                    active={activeItem === 'Body'}
                                    onClick={this.handleItemClick}
                                />
                                <Menu.Item
                                    name='3DScanner'
                                    active={activeItem === '3DScanner'}
                                    onClick={this.handleItemClick}
                                />
                            </Menu>

                            <Segment textAlign='center' attached='bottom'>
                                {this.getComponent()}
                            </Segment>
                        </Grid.Column>
                        <Grid.Column width={16} textAlign='left' floated='left'>
                            <Button.Group floated='left' fluid>
                                <Button labelPosition='left' icon floated='left' size='tiny' onClick={this.onCancel} ><Icon size='large' name='cancel' color='red' />Cancel</Button>
                                <Button labelPosition='left' icon floated='left' size='tiny' onClick={this.onSave} ><Icon size='large' name='check' color='green' />Save</Button>
                                <Modal
                                    open={this.state.openReview}
                                    onClose={() => this.handleOpen(false)}
                                    onOpen={() => this.handleOpen(true)}
                                    trigger={<Button labelPosition='left' size='tiny' icon ><Icon size='large' name='file alternate outline' color='black' />Review</Button>}>
                                    <Modal.Header>Body assessments until {this.state.selectedDate.toLocaleDateString()}</Modal.Header>
                                    <Modal.Content scrolling>
                                        <Modal.Description>
                                            <MeasurementsReviewModal date={this.state.selectedDate.toISOString()} height={this.getHeight()} age={this.state.age} senderId={this.props.logins[0].clientId} clientId={this.props.logins[0].clientId} update={this.state.updated} />
                                        </Modal.Description>
                                    </Modal.Content>
                                    <Modal.Actions>
                                        <Button size='tiny' onClick={() => this.handleOpen(false)} primary>
                                            Close <Icon name='chevron right' />
                                        </Button>
                                    </Modal.Actions>
                                </Modal>
                            </Button.Group>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </div>);
        }
        return (<Redirect to="/" />);
    }
}

//export default connect()(Home);
export default connect(
    (state: ApplicationState) => state.logins, // Selects which state properties are merged into the component's props
    LoginStore.actionCreators // Selects which action creators are merged into the component's props
)(Measurements as any);