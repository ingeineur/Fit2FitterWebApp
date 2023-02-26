import * as React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';
import { Menu, Segment, Grid, Dimmer, Label, Loader, Image, List, Flag, Dropdown, Divider } from 'semantic-ui-react'
import { ApplicationState } from '../store';
import * as LoginStore from '../store/Login';
import SemanticDatepicker from 'react-semantic-ui-datepickers';
import 'react-semantic-ui-datepickers/dist/react-semantic-ui-datepickers.css';
import AppsMenu from './AppMenus';
import { getColour, getBodyfatForeColour } from '../models/measurement';

interface IProps {
}

interface IState {
    username: string;
    password: string;
    selectedDate: Date;
    prevDate: Date;
    guides: IActivityGuides;
    totalActivities: ITotalDailyActivity;
    activities: IActivity[];
    updated: boolean;
    apiUpdate: boolean;
    clientDownloaded: boolean;
    activityDtos: IActivityDto[];
    activityDtosUpdated: boolean;
    activityDtosDownloaded: boolean;
    dateChanged: boolean;
    clients: IClient[];
    clientDtos: IClientDto[];
    group: string;
    activity2Dtos: IActivityDto[];
    activity2DtosUpdated: boolean;
    activity2DtosDownloaded: boolean;
    fromDate: Date;
    clientList: IOption[];
    toClientId: number;
    bodyfatIndicator: string;
}

interface IOption {
    key: string,
    text: string,
    value: string
}

interface IClient {
    id: number
    name: string;
    age: number;
    city: string;
    grp: string;
    img: string;
    avatar: string;
}

interface IActivityGuides {
    calories: number;
    steps: number;
}

interface ITotalDailyActivity {
    calories: number;
    steps: number;
}

interface IActivity {
    name: string,
    img: string,
    calories: number;
    steps: number;
    ActivityDesc: string;
}

interface IClientDto {
    id: number,
    lastName: string;
    firstName: string;
    address: string;
    city: string;
    age: number;
    grp: string;
    created: string;
    avatar: string;
}

interface IActivityDto {
    id: number,
    calories: number;
    steps: number;
    description: string;
    check: boolean;
    updated: string;
    created: string;
    clientId: number;
}

// At runtime, Redux will merge together...
type LoginProps =
    IProps
    & LoginStore.LoginState // ... state we've requested from the Redux store
    & typeof LoginStore.actionCreators // ... plus action creators we've requested
    & RouteComponentProps<{ username: string, password: string }>; // ... plus incoming routing parameters

class Leaderboard extends React.Component<LoginProps, IState> {
    public componentDidMount() {
        this.props.getLogin();
        var today = new Date();
        today.setHours(0, 0, 0, 0);
        this.setState({ selectedDate: today });

        var fromDate = new Date();
        fromDate.setDate(fromDate.getDate() - 15);
        fromDate.setHours(0, 0, 0, 0);
        this.setState({ fromDate: fromDate });
        
        if (this.props.logins.length > 0) {
            var clientId = this.props.logins[0].clientId;
            if (this.props.logins[0].clientId !== 2) {
                this.setState({ toClientId: this.props.logins[0].clientId });
            }
            else {
                clientId = 3;
                this.setState({ toClientId: clientId });
            }

            //get client info
            fetch('api/client/all')
                .then(response => response.json() as Promise<IClientDto[]>)
                .then(data => this.setState({
                    clientDtos: data, apiUpdate: true
                })).catch(error => console.log(error));

            //get all activities
            fetch('api/tracker/activity?date=' + today.toISOString())
                .then(response => response.json() as Promise<IActivityDto[]>)
                .then(data => this.setState({
                    activityDtos: data, activityDtosUpdated: true
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

    addActivity = (event: any) => {
        this.state.activities.push({ name: '', img: '', ActivityDesc: 'test', steps: 1, calories: 100 });
        this.setState({ updated: !this.state.updated });
    }

    setClientsFromDto = () => {
        if (this.state.clients.length > 0) {
            return;
        }

        this.state.clientDtos.forEach(client => {
            this.state.clients.push({ id: client.id, img: client.avatar, name: client.firstName, age: client.age, city: client.city, grp: client.grp, avatar: client.avatar });
        });

        var client = this.state.clientDtos[this.state.clientDtos.findIndex(x => x.id === this.state.toClientId)]
        if (client !== undefined) {
            this.setState({ group: client.grp, clients: this.state.clients });
        }
    }

    constructor(props: LoginProps) {
        super(props);
        this.state = {
            username: '', password: '',
            selectedDate: new Date(),
            prevDate: new Date(),
            guides: { calories: 150, steps: 10000 },
            totalActivities: { calories: 0, steps: 0 },
            activities: [],
            updated: false,
            apiUpdate: false,
            clientDownloaded: false,
            activityDtos: [],
            activityDtosUpdated: false,
            activityDtosDownloaded: false,
            dateChanged: false,
            clientDtos: [],
            clients: [],
            group: '',
            activity2Dtos: [],
            activity2DtosUpdated: false,
            activity2DtosDownloaded: false,
            fromDate: new Date(),
            clientList: [],
            toClientId: 3,
            bodyfatIndicator: ''
        };
    }

    getData = () => {
        if (!this.state.activityDtosUpdated) {
            //get all activities
            fetch('api/tracker/activity?date=' + this.state.selectedDate.toISOString())
                .then(response => response.json() as Promise<IActivityDto[]>)
                .then(data => this.setState({
                    activityDtos: data, activityDtosUpdated: true
                })).catch(error => console.log(error));
        }
    }

    getFlag = (country: string) => {
        if (country === 'au') {
            return (<Flag name='au' />)
        }

        if (country === 'jp') {
            return (<Flag name='jp' />)
        }

        if (country === 'my') {
            return (<Flag name='my' />)
        }

        if (country === 'us') {
            return (<Flag name='us' />)
        }

        if (country === 'ie') {
            return (<Flag name='ie' />)
        }

        if (country === 'sg') {
            return (<Flag name='sg' />)
        }
    }

    getPhoto = (img: string) => {
        if (img != '') {
            return '/images/avatars/' + img;
        }

        return 'https://react.semantic-ui.com/images/avatar/small/rachel.png';
    }

    getRows = (type: string) => {
        var sorted = this.state.activities.sort((a, b) => (a.steps > b.steps ? -1 : 1));
        if (type === 'TCB') {
            sorted = this.state.activities.sort((a, b) => (a.calories > b.calories ? -1 : 1));
        }
        return (
            sorted.map((item, index) =>
                <List.Item key={index}>
                    <Image key={index} avatar src={this.getPhoto(item.img)} />
                    <List.Content key={index + 1}>
                        <List.Header key={index} as='a'>{item.name} {this.getFlag(item.ActivityDesc)}</List.Header>
                        <List.Description key={index + 1}>
                            Steps: {item.steps} Calories: {item.calories}
                        </List.Description>
                    </List.Content>
                </List.Item>
            ));
    }

    handleDateChange = (event: any, field: any) => {
        var newDate = new Date(field['value']);
        
        var dayDiff = Math.abs((this.state.prevDate.getTime() - newDate.getTime()) / (1000 * 3600 * 24));
        if (dayDiff < 356) {
            this.setState({ prevDate: this.state.selectedDate });
            this.setState({ selectedDate: new Date(field['value']), dateChanged: true })
        }
    }

    setActivities = () => {
        if (this.state.activityDtos.length > 0 && this.state.clients.length > 0) {

            if (this.state.activities.length > 0) {
                return;
            }

            this.state.activityDtos.forEach(activity => {
                var clientActivity = this.state.clients[this.state.clients.findIndex(x => x.id === activity.clientId)];
                if (clientActivity !== null && this.state.group === clientActivity.grp) {
                    this.state.activities.push({ name: clientActivity.name, img: clientActivity.img, ActivityDesc: clientActivity.city, calories: activity.calories, steps: activity.steps });
                }
            })
        }
    }

    getActivities = () => {
        this.setState({ activityDtosUpdated: false });
        fetch('api/tracker/activity?date=' + this.state.selectedDate.toISOString())
            .then(response => response.json() as Promise<IActivityDto[]>)
            .then(data => {
                this.setState({
                    activityDtos: data, activityDtosUpdated: true
                });
            }).catch(error => console.log(error));
    }

    resetActivities = () => {
        while (this.state.activities.length > 0) {
            this.state.activities.pop();
        }

        this.setState({
            activities: this.state.activities
        });
    }

    getLeaderboard = () => {
        return (<Grid centered>
            <Grid.Row columns={2}>
                <Grid.Column verticalAlign='middle' floated='left' textAlign='left'>
                </Grid.Column>
                <Grid.Column verticalAlign='middle' floated='right' textAlign='right'>
                    <SemanticDatepicker value={this.state.selectedDate} date={new Date()} onChange={this.handleDateChange} showToday />
                </Grid.Column>
            </Grid.Row>
            <Grid.Row columns={2}>
                <Grid.Column>
                    <Segment inverted attached='top'>
                        <h5>Steps Leaderboard</h5>
                    </Segment>
                    <Segment attached='bottom'>
                        <List>
                            {this.getRows('TS')}
                        </List>
                    </Segment>
                </Grid.Column>
                <Grid.Column>
                    <Segment inverted attached='top'>
                        <h5>TCB Leaderboard</h5>
                    </Segment>
                    <Segment attached='bottom'>
                        <List>
                            {this.getRows('TCB')}
                        </List>
                    </Segment>
                </Grid.Column>
            </Grid.Row>
        </Grid>)
    }

    getPhotoProfile = () => {
        if (this.state.clients.length > 0) {
            var img = this.state.clients[this.state.clients.findIndex(x => x.id == this.state.toClientId)].avatar;
            if (img != '') {
                return '/images/avatars/' + img;
            }
        }

        return 'https://react.semantic-ui.com/images/avatar/small/rachel.png';
    }

    getUserInfo = () => {
        var name = ""
        if (this.state.clients.length > 0) {
            var name = this.state.clients[this.state.clients.findIndex(x => x.id == this.state.toClientId)].name;
        }

        var lastSeen = new Date(this.props.logins[0].lastLogin);
        return name + ', last login: ' + lastSeen.toLocaleDateString();
    }

    getBodyFatDivStyle = () => {
        return {
            color: getBodyfatForeColour(this.state.bodyfatIndicator),
            backgroundColor: getColour(this.state.bodyfatIndicator)
        }
    }

    isLoadingData = () => {
        return (this.state.activityDtosDownloaded == false || this.state.clientDownloaded == false)
    }

    setToClient = (event: any, data: any) => {
        this.setState({ toClientId: data['value'], dateChanged: true });
    }

    getAllClientsOptions = () => {
        if (this.props.logins[0].username === 'admin') {
            return (<div>
                <a>Select Client:</a><Dropdown id='toClient' value={this.state.toClientId} search selection options={this.state.clientList} onChange={this.setToClient} />
            </div>);
        }
    }

    render() {
        var divLoaderStyle = {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        };

        if (this.props.logins.length > 0) {
            if (this.state.dateChanged === true) {
                this.setState({ dateChanged: false });
                this.resetActivities();
                this.getActivities();
            }

            if (this.state.apiUpdate === true) {
                this.setClientsFromDto();
                if (this.state.clientList.length < 1) {
                    this.state.clientDtos.forEach(client => {
                        this.state.clientList.push({ key: client.id.toString(), text: client.firstName, value: client.id.toString() });
                    });
                }

                this.setState({ apiUpdate: false, clientDownloaded: true, clientList: this.state.clientList });
            }

            if (this.state.activityDtosUpdated === true) {
                this.setActivities();
                this.setState({ activities: this.state.activities, activityDtosUpdated: false, activityDtosDownloaded: true });
            }

            if (this.state.activity2DtosUpdated === true) {
                this.setState({ activity2DtosUpdated: false, activity2DtosDownloaded: true });
            }

            if (this.isLoadingData()) {
                return (<div style={divLoaderStyle}>
                    <Dimmer active inverted>
                        <Loader content='Loading' />
                    </Dimmer>
                </div>);
            }
        return (
            <div>
                <Grid centered>
                    <Grid.Row>
                        <Grid.Column width={16}>
                            <AppsMenu activeParentItem='Dashboard' activeItem='Leaderboard' logins={this.props.logins} clientDtos={this.state.clientDtos} />
                        </Grid.Column>
                        <Grid.Column width={16}>
                            {this.getLeaderboard()}
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
)(Leaderboard as any);