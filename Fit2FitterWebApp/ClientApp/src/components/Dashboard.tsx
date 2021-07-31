import * as React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';
import { Menu, Segment, Grid, Dimmer, Label, Loader, Image, List, Flag, Dropdown, Divider } from 'semantic-ui-react'
import { ApplicationState } from '../store';
import * as LoginStore from '../store/Login';
import SemanticDatepicker from 'react-semantic-ui-datepickers';
import 'react-semantic-ui-datepickers/dist/react-semantic-ui-datepickers.css';
import { IMacroGuides, IMacrosPlanDto, IMealDto, IMealDetails, IMeals } from '../models/meals';
import { getActivityLevel } from '../models/activities';
import ChartistGraph from 'react-chartist';
import AppsMenu from './AppMenus';
import { isNull } from 'util';

var divLabelStyle1 = {
    color: '#0a0212',
};

interface IProps {
}

interface IState {
    username: string;
    password: string;
    activeItem: string;
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
    macroGuides: IMacroGuides;
    macrosPlanDtos: IMacrosPlanDto[];
    macrosPlanDtosUpdated: boolean;
    macrosPlanDtosDownloaded: boolean;
    mealDtos: IMealDto[];
    mealDtosUpdated: boolean;
    mealDtosDownloaded: boolean;
    activity2Dtos: IActivityDto[];
    activity2DtosUpdated: boolean;
    activity2DtosDownloaded: boolean;
    fromDate: Date;
    weightLabel: string[];
    activityLabel: string[];
    graphActivityValues: IGraphActivity;
    measurementDtos: IMeasurementDto[];
    measurementDtosUpdated: boolean;
    measurementDtosDownloaded: boolean;
    queryStatus: string;
    clientList: IOption[];
    toClientId: number;
    bodyfatIndicator: string;
}

interface IOption {
    key: string,
    text: string,
    value: string
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

interface IGraphActivity {
    steps: number[];
    calories: number[];
    weights: number[];
    bodyFats: number[];
    carbs: number[];
    protein: number[];
    fat: number[];
}

var type = 'Line';
var bar = 'Bar';

var lineChartOptions = {
    reverseData: false,
    showArea: true
}

var barChartOptions = {
    reverseData: false,
    seriesBarDistance: 10
};

var divCarb = {
    color: 'red',
    backgroundColor: 'red'
};

var divPro = {
    color: '#FF5E13',
    backgroundColor: '#FF5E13'
};

var divFat = {
    color: 'yellow',
    backgroundColor: 'yellow'
};

// At runtime, Redux will merge together...
type LoginProps =
    IProps
    & LoginStore.LoginState // ... state we've requested from the Redux store
    & typeof LoginStore.actionCreators // ... plus action creators we've requested
    & RouteComponentProps<{ username: string, password: string }>; // ... plus incoming routing parameters

class Dashboard extends React.Component<LoginProps, IState> {
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

            if (this.state.activeItem == 'Leaderboard') {
                //get all activities
                fetch('api/tracker/activity?date=' + today.toISOString())
                    .then(response => response.json() as Promise<IActivityDto[]>)
                    .then(data => this.setState({
                        activityDtos: data, activityDtosUpdated: true
                    })).catch(error => console.log(error));
            }
            else {
                //get all activities
                fetch('api/tracker/' + clientId + '/activity/slice?fromDate=' + fromDate.toISOString() + '&toDate=' + today.toISOString())
                    .then(response => response.json() as Promise<IActivityDto[]>)
                    .then(data => this.setState({
                        activity2Dtos: data, activity2DtosUpdated: true
                    })).catch(error => console.log(error));

                //get macros plan
                fetch('api/client/' + clientId + '/macrosplan')
                    .then(response => response.json() as Promise<IMacrosPlanDto[]>)
                    .then(data => this.setState({
                        macrosPlanDtos: data, macrosPlanDtosUpdated: true
                    })).catch(error => console.log(error));

                //get all meals
                fetch('api/tracker/' + clientId + '/macrosguide/slice?fromDate=' + fromDate.toISOString() + '&toDate=' + today.toISOString())
                    .then(response => response.json() as Promise<IMealDto[]>)
                    .then(data => this.setState({
                        mealDtos: data, mealDtosUpdated: true
                    })).catch(error => console.log(error));

                //get all measurements
                fetch('api/client/' + clientId + '/all/measurements/slice?fromDate=' + fromDate.toISOString() + '&toDate=' + today.toISOString())
                    .then(response => response.json() as Promise<IMeasurementDto[]>)
                    .then(data => this.setState({
                        measurementDtos: data, measurementDtosUpdated: true
                    })).catch(error => console.log(error));
            }
        }
    }

    onSubmit = () => {
        this.setState({ username: '', password: '' });
    }

    updateInput = (event: any) => {
        this.setState({ username: event.target.value });
        console.log(event.target.value);
    }

    updateInput2 = (event: any) => {
        this.setState({ password: event.target.value });
        console.log(event.target.value);
    }

    addActivity = (event: any) => {
        this.state.activities.push({ name: '', img: '', ActivityDesc: 'test', steps: 1, calories: 100 });
        this.setState({ updated: !this.state.updated });
        //console.log(this.state.activities);
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
            activeItem: 'Progress',
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
            macroGuides: { carb: 0, protein: 0, fat: 0, fruits: 0 },
            macrosPlanDtos: [],
            macrosPlanDtosUpdated: false,
            macrosPlanDtosDownloaded: false,
            mealDtos: [],
            mealDtosDownloaded: false,
            mealDtosUpdated: false,
            activity2Dtos: [],
            activity2DtosUpdated: false,
            activity2DtosDownloaded: false,
            fromDate: new Date(),
            weightLabel: [],
            activityLabel: [],
            graphActivityValues: { steps: [], calories: [], weights: [], bodyFats: [], fat: [], carbs: [], protein: [] },
            measurementDtos: [],
            measurementDtosDownloaded: false,
            measurementDtosUpdated: false,
            queryStatus: 'no error',
            clientList: [],
            toClientId: 3,
            bodyfatIndicator: ''
        };
    }

    getData = (activeItem: string) => {
        if (activeItem == 'Leaderboard') {
            if (!this.state.activityDtosUpdated) {
                //get all activities
                fetch('api/tracker/activity?date=' + this.state.selectedDate.toISOString())
                    .then(response => response.json() as Promise<IActivityDto[]>)
                    .then(data => this.setState({
                        activityDtos: data, activityDtosUpdated: true
                    })).catch(error => console.log(error));
            }
        }
        else {
            if (!this.state.activity2DtosUpdated) {
                //get all activities
                fetch('api/tracker/' + this.state.toClientId + '/activity/slice?fromDate=' + this.state.fromDate.toISOString() + '&toDate=' + this.state.selectedDate.toISOString())
                    .then(response => response.json() as Promise<IActivityDto[]>)
                    .then(data => this.setState({
                        activity2Dtos: data, activity2DtosUpdated: true
                    })).catch(error => console.log(error));
            }

            if (!this.state.macrosPlanDtosUpdated) {
                //get macros plan
                fetch('api/client/' + this.state.toClientId + '/macrosplan')
                    .then(response => response.json() as Promise<IMacrosPlanDto[]>)
                    .then(data => this.setState({
                        macrosPlanDtos: data, macrosPlanDtosUpdated: true
                    })).catch(error => console.log(error));
            }

            if (!this.state.mealDtosUpdated) {
                //get all meals
                fetch('api/tracker/' + this.state.toClientId + '/macrosguide/slice?fromDate=' + this.state.fromDate.toISOString() + '&toDate=' + this.state.selectedDate.toISOString())
                    .then(response => response.json() as Promise<IMealDto[]>)
                    .then(data => this.setState({
                        mealDtos: data, mealDtosUpdated: true
                    })).catch(error => console.log(error));
            }

            if (!this.state.measurementDtosUpdated) {
                fetch('api/client/' + this.state.toClientId + '/all/measurements/slice?fromDate=' + this.state.fromDate.toISOString() + '&toDate=' + this.state.selectedDate.toISOString())
                    .then(response => response.json() as Promise<IMeasurementDto[]>)
                    .then(data => this.setState({
                        measurementDtos: data, measurementDtosUpdated: true
                    })).catch(error => console.log(error));
            }
        }
    }

    handleItemClick = (e: any, { name }: any) => {
        this.setState({ activeItem: name });
        this.getData(name);
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
        if (Math.abs((this.state.fromDate.getTime() - newDate.getTime()) / (1000 * 3600 * 24)) > 50) {
            this.setState({ queryStatus: 'Error : Exceeded number of days' });
            return;
        }
        this.setState({ queryStatus: 'OK' });

        var dayDiff = Math.abs((this.state.prevDate.getTime() - newDate.getTime()) / (1000 * 3600 * 24));
        if (dayDiff < 356) {
            this.setState({ prevDate: this.state.selectedDate });
            this.setState({ selectedDate: new Date(field['value']), dateChanged: true })
        }
    }

    handleFromDateChange = (event: any, field: any) => {
        var newDate = new Date(field['value']);
        if (Math.abs((this.state.selectedDate.getTime() - newDate.getTime()) / (1000 * 3600 * 24)) > 50) {
            this.setState({ queryStatus: 'Error : Exceeded number of days' });
            return;
        }
        this.setState({ queryStatus: 'OK' });

        var dayDiff = Math.abs((this.state.prevDate.getTime() - newDate.getTime()) / (1000 * 3600 * 24));
        if (dayDiff < 356) {
            this.setState({ prevDate: this.state.fromDate });
            this.setState({ fromDate: new Date(field['value']), dateChanged: true })
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
            color: this.getBodyfatForeColour(this.state.bodyfatIndicator),
            backgroundColor: this.getBodyfatColour(this.state.bodyfatIndicator)
        }
    }

    getProgress = () => {
        return (<Grid centered>
            <Grid.Row columns={2}>
                <Grid.Column width={6}>
                </Grid.Column>
                <Grid.Column width={10} textAlign='right'>
                    {this.getAllClientsOptions()}
                    <Image avatar src={this.getPhotoProfile()} />
                    <a>{this.getUserInfo()}</a>
                </Grid.Column>
                <Grid.Column width={6} verticalAlign='middle' floated='left' textAlign='left'>
                    <div><a>From</a></div>
                </Grid.Column>
                <Grid.Column width={10} verticalAlign='middle' floated='left' textAlign='right'>
                    <SemanticDatepicker value={this.state.fromDate} date={new Date()} onChange={this.handleFromDateChange} showToday />
                </Grid.Column>
                <Grid.Column width={6} verticalAlign='middle' floated='left' textAlign='left'>
                    <div><a>To</a></div>
                </Grid.Column>
                <Grid.Column width={10} verticalAlign='middle' floated='left' textAlign='right'>
                    <SemanticDatepicker value={this.state.selectedDate} date={new Date()} onChange={this.handleDateChange} showToday />
                </Grid.Column>
            </Grid.Row>
            <div style={this.getDivLabelStyle()}>{this.state.queryStatus}</div>
            <Grid.Row>
                <Grid.Column>
                    <span>
                        <a>Macros Consumptions </a>
                        <a style={divCarb}>col</a><a>Carb% </a><a style={divPro}>col</a><a>Protein%</a><a style={divFat}>col</a><a> Fat% </a>
                    </span>
                    <div>
                        <ChartistGraph data={this.getGraphData('Macros')} type={bar} options={barChartOptions} />
                    </div>
                    <a>Steps (Count)</a>
                    <div>
                        <ChartistGraph data={this.getGraphData('Steps')} type={type} options={lineChartOptions} />
                    </div>
                    <a>Total Burned Calories</a>
                    <div>
                        <ChartistGraph data={this.getGraphData('Calories')} type={type} options={lineChartOptions} />
                    </div>
                    <a>Weight (Kg)</a>
                    <div>
                        <ChartistGraph data={this.getGraphData('Weight')} type={type} options={lineChartOptions} />
                    </div>
                    <a style={this.getBodyFatDivStyle()}>Body Fat: {this.state.bodyfatIndicator}</a>
                    <div>
                        <ChartistGraph data={this.getGraphData('BodyFat')} type={type} options={lineChartOptions} />
                    </div>
                </Grid.Column>
            </Grid.Row>
        </Grid>)
    }

    getDashboard = () => {
        if (this.state.activeItem == 'Leaderboard') {
            return this.getLeaderboard();
        }
        else if (this.state.activeItem == 'Progress') {
            return this.getProgress();
        }
    }

    isLoadingData = () => {
        if (this.state.activeItem == 'Leaderboard') {
            return (this.state.activityDtosDownloaded == false || this.state.clientDownloaded == false) 
        }
        else {
            return (this.state.activity2DtosDownloaded == false || this.state.mealDtosDownloaded == false ||
                this.state.measurementDtosDownloaded == false || this.state.clientDownloaded == false ||
                this.state.macrosPlanDtosDownloaded == false) 
        }
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

    getBodyfatColour = (level: string) => {
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

    getBodyfatForeColour = (level: string) => {
        if (level === 'AVERAGE') {
            return 'black';
        }

        return 'white';
    }

    getGraphData = (measureType: string) => {
        if (measureType === 'Steps') {
            return { labels: this.state.activityLabel, series: [this.state.graphActivityValues.steps] };
        }

        if (measureType === 'Macros') {
            return { labels: this.state.activityLabel, series: [this.state.graphActivityValues.carbs, this.state.graphActivityValues.protein, this.state.graphActivityValues.fat] };
        }

        if (measureType === 'Weight') {
            return { labels: this.state.activityLabel, series: [this.state.graphActivityValues.weights] };
        }

        if (measureType === 'BodyFat') {
            return { labels: this.state.activityLabel, series: [this.state.graphActivityValues.bodyFats] };
        }
        
        return { labels: this.state.activityLabel, series: [this.state.graphActivityValues.calories] };
    }

    setActivityGraphValues = () => {
        if (this.state.graphActivityValues.steps.length == this.state.activity2Dtos.length &&
            this.state.graphActivityValues.weights.length == this.state.measurementDtos.length &&
            this.state.graphActivityValues.carbs.length == this.state.mealDtos.length) {
            return;
        }

        while (this.state.activityLabel.length > 0) {
            this.state.activityLabel.pop()
        }

        this.state.graphActivityValues.steps = [];
        this.state.graphActivityValues.calories = [];
        this.state.graphActivityValues.weights = [];
        this.state.graphActivityValues.bodyFats = [];
        this.state.graphActivityValues.carbs = [];
        this.state.graphActivityValues.protein = [];
        this.state.graphActivityValues.fat = [];

        var index: number = 0;
        var arr = this.state.activity2Dtos.sort((a: IActivityDto, b: IActivityDto) => {
            return (new Date(a.created)).getTime() - (new Date(b.created)).getTime();

        });

        arr.forEach(m => {
            if (index === 0 || index === arr.length - 1 || index === (arr.length/2 - 1)) {
                this.state.activityLabel.push((new Date(m.created)).toLocaleDateString().slice(0, 5));
            }
            else {
                this.state.activityLabel.push('');
            }

            this.state.graphActivityValues.steps.push(m.steps);
            this.state.graphActivityValues.calories.push(m.calories);
            index++;
        });

        var arr2 = this.state.measurementDtos.sort((a: IMeasurementDto, b: IMeasurementDto) => {
            return (new Date(a.created)).getTime() - (new Date(b.created)).getTime();

        });

        arr2.forEach(m => {
            this.state.graphActivityValues.weights.push(m.weight);
            this.state.graphActivityValues.bodyFats.push((m.waist + m.hips - m.neck) / 2);
        });

        var arr3 = this.state.mealDtos.sort((a: IMealDto, b: IMealDto) => {
            return (new Date(a.created)).getTime() - (new Date(b.created)).getTime();

        });

        arr3.forEach(m => {
            this.state.graphActivityValues.carbs.push((m.carb / this.state.macroGuides.carb) * 100.0);
            this.state.graphActivityValues.protein.push((m.protein / this.state.macroGuides.protein) * 100.0);
            this.state.graphActivityValues.fat.push((m.fat / this.state.macroGuides.fat) * 100.0);
        });

        this.setState({ graphActivityValues: this.state.graphActivityValues, activityLabel: this.state.activityLabel });
    }

    setMacroGuides = () => {
        if (this.state.macrosPlanDtos.length > 0 && this.state.clientDtos.length > 0) {
            var client = this.state.clientDtos[this.state.clientDtos.findIndex(x => x.id === this.props.logins[0].clientId)];
            const macrosPlan = this.state.macrosPlanDtos[0];

            let carb = isNull(macrosPlan.carbWeight) ? '0.0' : macrosPlan.carbWeight.toString();
            let protein = isNull(macrosPlan.proteinWeight) ? '0.0' : macrosPlan.proteinWeight.toString();
            let fat = isNull(macrosPlan.fatWeight) ? '0.0' : macrosPlan.fatWeight.toString();

            if (isNull(macrosPlan.manual) || macrosPlan.manual === false) {
                const bmr = (10 * macrosPlan.weight) + (6.25 * macrosPlan.height) - (5 * client.age) - 161;
                const totalCalories = getActivityLevel(macrosPlan.activityLevel) * bmr;
                carb = ((macrosPlan.carbPercent / 100.0 * totalCalories) / 4).toFixed(2);
                protein = ((macrosPlan.proteinPercent / 100.0 * totalCalories) / 4).toFixed(2);
                fat = ((macrosPlan.fatPercent / 100.0 * totalCalories) / 9).toFixed(2);
            }
            
            this.state.macroGuides.carb = parseFloat(carb);
            this.state.macroGuides.protein = parseFloat(protein);
            this.state.macroGuides.fat = parseFloat(fat);
            this.state.macroGuides.fruits = 4;
            this.setState({ guides: this.state.guides });
        }
    }

    getColour = () => {
        if (this.state.queryStatus.includes('Error')) {
            return 'red';
        }

        return 'green';
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

    resetGraphData = () => {
        this.state.graphActivityValues.bodyFats = [];
        this.state.graphActivityValues.calories = [];
        this.state.graphActivityValues.carbs = [];
        this.state.graphActivityValues.fat = [];
        this.state.graphActivityValues.protein = [];
        this.state.graphActivityValues.steps = [];
        this.state.graphActivityValues.weights = [];
        this.setState({
            graphActivityValues: this.state.graphActivityValues, activity2DtosUpdated: false, activity2DtosDownloaded: false, mealDtosDownloaded: false,
            mealDtosUpdated: false, measurementDtosDownloaded: false, measurementDtosUpdated: false,
            activity2Dtos: [], mealDtos: [], measurementDtos: []
        });
    }

    getDivLabelStyle = () => {
        return ({
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: '#fffafa',
            backgroundColor: this.getColour()
        });
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
                if (this.state.activeItem == 'Leaderboard') {
                    this.resetActivities();
                    this.getActivities();
                }
                else {
                    this.resetGraphData();
                    this.getData(this.state.activeItem);
                }
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

            if (this.state.mealDtosUpdated === true) {
                this.setState({ mealDtosDownloaded: true, mealDtosUpdated: false });
            }

            if (this.state.macrosPlanDtosUpdated === true && this.state.clientDownloaded === true) {
                this.setState({ macrosPlanDtosUpdated: false, macrosPlanDtosDownloaded: true });
                this.setMacroGuides();
            }

            if (this.state.measurementDtosUpdated === true) {
                const bodyFatPercent = (((parseFloat(this.state.measurementDtos[0].waist.toString()) + parseFloat(this.state.measurementDtos[0].hips.toString())) - parseFloat(this.state.measurementDtos[0].neck.toString())) / 2);
                var client = this.state.clientDtos[this.state.clientDtos.findIndex(x => x.id === this.props.logins[0].clientId)];
                const level = this.getBodyFatIndicator(client.age, bodyFatPercent);
                this.setState({ measurementDtosDownloaded: true, measurementDtosUpdated: false, bodyfatIndicator: level });
            }

            this.setActivityGraphValues();
            const activeItem = this.state.activeItem;

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
                            <AppsMenu activeItem='Dashboard' logins={this.props.logins} clientDtos={this.state.clientDtos} />
                        </Grid.Column>
                        <Grid.Column width={16}>
                            <Menu attached='top' pointing compact>
                                <Menu.Item
                                    name='Leaderboard'
                                    active={activeItem === 'Leaderboard'}
                                    onClick={this.handleItemClick}
                                />
                                <Menu.Item
                                    name='Progress'
                                    active={activeItem === 'Progress'}
                                    onClick={this.handleItemClick}
                                />
                            </Menu>
                            <Segment attached='bottom'>
                                {this.getDashboard()}
                            </Segment>
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
)(Dashboard as any);