import * as React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';
import { Menu, Segment, Grid, Dimmer, Label, Loader, Image, List, Flag, Dropdown, Divider } from 'semantic-ui-react'
import { ApplicationState } from '../store';
import * as LoginStore from '../store/Login';
import 'react-semantic-ui-datepickers/dist/react-semantic-ui-datepickers.css';
import { IMacroGuides, IMacrosPlanDto, IMealDto, IMealDetails, IMeals } from '../models/meals';
import { getActivityLevel } from '../models/activities';
import AppsMenu from './AppMenus';
import { isNull } from 'util';
import { IMeasurements, IMeasurementDto, IGraphMeasurements, calcBodyFatPercent, getBodyFatIndicator, getColour, getBodyfatForeColour } from '../models/measurement';
import { AreaChart, LineChart, BarChart } from "@tremor/react";
import { Datepicker } from "@tremor/react";
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
    cup: number[];
    palm: number[];
    thumb: number[];
}

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
        fromDate.setDate(fromDate.getDate() - 8);
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
            graphActivityValues: { steps: [], calories: [], weights: [], bodyFats: [], fat: [], carbs: [], protein: [], cup: [], palm: [], thumb: [] },
            measurementDtos: [],
            measurementDtosDownloaded: false,
            measurementDtosUpdated: false,
            queryStatus: 'no error',
            clientList: [],
            toClientId: 3,
            bodyfatIndicator: ''
        };
    }

    getData = () => {
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

    handleDateChange = (start: any, end: any) => {
        this.setState({ dateChanged: true, fromDate: start, selectedDate: end });
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
        return name;
    }

    getBodyFatDivStyle = () => {
        return {
            color: getBodyfatForeColour(this.state.bodyfatIndicator),
            backgroundColor: getColour(this.state.bodyfatIndicator)
        }
    }

    GetBodyTypeMetric = (level: string) => {
        return (
            <Grid centered>
                <Grid.Row textAlign='center' columns={2}>
                    <Grid.Column textAlign='center'>
                        <Card key="detail">
                            <Flex alignItems="items-center">
                                <Text>DETAIL</Text>
                            </Flex>
                            <Flex
                                justifyContent="justify-start"
                                alignItems="items-baseline"
                            >
                                <Image avatar src={this.getPhotoProfile()} />
                                <Metric>{this.getUserInfo()}</Metric>
                            </Flex>
                        </Card>
                    </Grid.Column>
                    <Grid.Column textAlign='center'>
                        <Card key="bodyfat">
                            <Flex alignItems="items-center">
                                <Text>BODY RATING</Text>
                            </Flex>
                            <Flex
                                justifyContent="justify-start"
                                alignItems="items-baseline"
                            >
                                <Metric color={getColour(level)}>{level}</Metric>
                            </Flex>
                        </Card>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        );
    }

    getProgress = () => {
        return (<Grid centered>
            <Grid.Row columns={2}>
                <Grid.Column width={6}>
                </Grid.Column>
                <Grid.Column width={10} textAlign='right'>
                    {this.getAllClientsOptions()}
                </Grid.Column>
            </Grid.Row>
            <Grid.Row>
                <Grid.Column width={16}>
                    {this.GetBodyTypeMetric(this.state.bodyfatIndicator)}
                    <Datepicker
                        placeholder="Select..."
                        enableRelativeDates={false}
                        enableYearPagination={false}
                        handleSelect={this.handleDateChange}
                        defaultStartDate={this.state.fromDate}
                        defaultEndDate={this.state.selectedDate}
                        defaultRelativeFilterOption={null}
                        minDate={null}
                        maxDate={null}
                        color="blue"
                        maxWidth="max-w-none"
                        marginTop="mt-0"
                    />
                </Grid.Column>
                <Grid.Column width={16}>
                    <div>
                        <BarChart
                            data={this.getGraphData('Macros')}
                            categories={["Carbs", "Protein", "Fat"]}
                            dataKey="date"
                            height="h-72"
                            colors={["red", "blue", "green"]}
                            marginTop="mt-4"
                        />
                    </div>
                    <div>
                        <BarChart
                            data={this.getGraphData('Portions')}
                            categories={["Cup", "Palm", "Thumb"]}
                            dataKey="date"
                            height="h-72"
                            colors={["red", "blue", "green"]}
                            marginTop="mt-4"
                        />
                    </div>
                    <div>
                        <AreaChart
                            data={this.getGraphData('Steps')}
                            categories={["Steps"]}
                            dataKey="date"
                            height="h-72"
                            colors={["indigo"]}
                            marginTop="mt-4"
                        />
                    </div>
                    <div>
                        <AreaChart
                            data={this.getGraphData('Calories')}
                            categories={["Calories"]}
                            dataKey="date"
                            height="h-72"
                            colors={["amber"]}
                            marginTop="mt-4"
                        />
                    </div>
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
                    <div>
                        <AreaChart
                            data={this.getGraphData('BodyFat')}
                            categories={["BodyFat"]}
                            dataKey="date"
                            height="h-72"
                            colors={["blue"]}
                            marginTop="mt-4"
                        />
                    </div>
                </Grid.Column>
            </Grid.Row>
        </Grid>)
    }

    isLoadingData = () => {
        return (this.state.activity2DtosDownloaded == false || this.state.mealDtosDownloaded == false ||
            this.state.measurementDtosDownloaded == false || this.state.clientDownloaded == false ||
            this.state.macrosPlanDtosDownloaded == false) 
    }

    getGraphData = (measureType: string) => {
        var chartData: any[] = [];
        var index: number = 0

        if (measureType === 'Steps') {
            this.state.activityLabel.forEach(m => {
                chartData.push({ date: m, Steps: this.state.graphActivityValues.steps[index] });
                index++;
            });
        }

        else if (measureType === 'Macros') {
            this.state.activityLabel.forEach(m => {
                chartData.push({ date: m, Carbs: this.state.graphActivityValues.carbs[index], Protein: this.state.graphActivityValues.protein[index], Fat: this.state.graphActivityValues.fat[index] });
                index++;
            });
        }

        else if (measureType === 'Portions') {
            this.state.activityLabel.forEach(m => {
                chartData.push({ date: m, Cup: this.state.graphActivityValues.cup[index], Palm: this.state.graphActivityValues.palm[index], Thumb: this.state.graphActivityValues.thumb[index] });
                index++;
            });
        }

        else if (measureType === 'Weight') {
            this.state.activityLabel.forEach(m => {
                chartData.push({ date: m, Weight: this.state.graphActivityValues.weights[index] });
                index++;
            });
        }

        else if (measureType === 'Calories') {
            this.state.activityLabel.forEach(m => {
                chartData.push({ date: m, Calories: this.state.graphActivityValues.calories[index] });
                index++;
            });
        }

        else if (measureType === 'BodyFat') {
            this.state.activityLabel.forEach(m => {
                chartData.push({ date: m, BodyFat: this.state.graphActivityValues.bodyFats[index] });
                index++;
            });
        }

        return chartData;
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
        this.state.graphActivityValues.cup = [];
        this.state.graphActivityValues.palm = [];
        this.state.graphActivityValues.thumb = [];

        var index: number = 0;
        var arr = this.state.activity2Dtos.sort((a: IActivityDto, b: IActivityDto) => {
            return (new Date(a.created)).getTime() - (new Date(b.created)).getTime();

        });

        arr.forEach(m => {
            var date = new Date(m.created);
            date.setHours(date.getHours() + 24);
            this.state.activityLabel.push(date.toLocaleDateString().slice(0, 5));
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

            this.state.graphActivityValues.cup.push(m.carb / 30);
            this.state.graphActivityValues.palm.push(m.protein / 30);
            this.state.graphActivityValues.thumb.push(m.fat / 12);
        });

        this.setState({ graphActivityValues: this.state.graphActivityValues, activityLabel: this.state.activityLabel });
    }

    setMacroGuides = () => {
        if (this.state.macrosPlanDtos.length > 0 && this.state.clientDtos.length > 0) {
            var client = this.state.clientDtos[this.state.clientDtos.findIndex(x => x.id == this.state.toClientId)];
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
        this.state.graphActivityValues.cup = [];
        this.state.graphActivityValues.thumb = [];
        this.state.graphActivityValues.palm = [];
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
                this.resetGraphData();
                this.getData();
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

            if (this.state.measurementDtosUpdated === true && this.state.clientDownloaded === true) {
                const bodyFatPercent = calcBodyFatPercent(this.state.macrosPlanDtos[this.state.macrosPlanDtos.length - 1].height, parseFloat(this.state.measurementDtos[this.state.measurementDtos.length - 1].neck.toString()), parseFloat(this.state.measurementDtos[this.state.measurementDtos.length - 1].waist.toString()), parseFloat(this.state.measurementDtos[this.state.measurementDtos.length - 1].hips.toString()));
                var client = this.state.clients[this.state.clients.findIndex(x => x.id == this.state.toClientId)];
                var level = getBodyFatIndicator(client.age, bodyFatPercent);
                this.setState({ measurementDtosDownloaded: true, measurementDtosUpdated: false, bodyfatIndicator: level });
            }

            this.setActivityGraphValues();
            
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
                            <AppsMenu activeParentItem='Dashboard' activeItem='Progress' logins={this.props.logins} clientDtos={this.state.clientDtos} />
                        </Grid.Column>
                        <Grid.Column width={16}>
                            {this.getProgress()}
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