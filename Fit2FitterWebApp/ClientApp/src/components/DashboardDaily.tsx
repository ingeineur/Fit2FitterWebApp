import * as React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';
import { Menu, Segment, Grid, Dimmer, Label, Loader, Image, List, Flag, Dropdown, Divider, Statistic, Icon } from 'semantic-ui-react'
import { ApplicationState } from '../store';
import * as LoginStore from '../store/Login';
import SemanticDatepicker from 'react-semantic-ui-datepickers';
import 'react-semantic-ui-datepickers/dist/react-semantic-ui-datepickers.css';
import { IMacroGuides, IMacrosPlanDto, IMealDto, IMealDetails, IMeals } from '../models/meals';
import { IActivityGuides, ITotalDailyActivity, IActivityDto, getStepIndicatorColour, getIndicatorColour, getMaxHrColour } from '../models/activities'
import { getActivityLevel } from '../models/activities';
import ChartistGraph from 'react-chartist';
import AppsMenu from './AppMenus';
import { isNullOrUndefined } from 'util';

interface IProps {
}

interface IState {
    username: string;
    password: string;
    selectedDate: Date;
    guides: IActivityGuides;
    updated: boolean;
    apiUpdate: boolean;
    clientDownloaded: boolean;
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
    queryStatus: string;
    toClientId: number;
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

interface IGraphActivity {
    steps: number[];
    calories: number[];
    maxHr: number[];
    weights: number[];
    bodyFats: number[];
    carbs: number[];
    protein: number[];
    fat: number[];
}

var bar = 'Bar';

var barChartOptions = {
    reverseData: false,
    horizontalBars: true,
    distributeSeries: true,
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

class DashboardDaily extends React.Component<LoginProps, IState> {
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
            
            //get client info
            fetch('api/client?clientId=' + this.props.logins[0].clientId)
                .then(response => response.json() as Promise<IClientDto[]>)
                .then(data => this.setState({
                    clientDtos: data, apiUpdate: true
                })).catch(error => console.log(error));

            //get all activities
            fetch('api/tracker/' + clientId + '/activity/slice?fromDate=' + today.toISOString() + '&toDate=' + today.toISOString())
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
            fetch('api/tracker/' + clientId + '/macrosguide/slice?fromDate=' + today.toISOString() + '&toDate=' + today.toISOString())
                .then(response => response.json() as Promise<IMealDto[]>)
                .then(data => this.setState({
                    mealDtos: data, mealDtosUpdated: true
                })).catch(error => console.log(error));
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

    constructor(props: LoginProps) {
        super(props);
        this.state = {
            username: '', password: '',
            selectedDate: new Date(),
            guides: { calories: 150, steps: 10000 },
            updated: false,
            apiUpdate: false,
            clientDownloaded: false,
            clientDtos: [],
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
            graphActivityValues: { steps: [], calories: [], maxHr: [], weights: [], bodyFats: [], fat: [], carbs: [], protein: [] },
            queryStatus: 'no error',
            toClientId: 3
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

        return (<Flag name='au' />)
    }

    getPhotoProfile = () => {
        if (this.state.clientDtos.length > 0) {
            var img = this.state.clientDtos[0].avatar;
            if (img != '') {
                return '/images/avatars/' + img;
            }
        }

        return 'https://react.semantic-ui.com/images/avatar/small/rachel.png';
    }

    getUserInfo = () => {
        var name = ""
        if (this.state.clientDtos.length > 0) {
            var name = this.state.clientDtos[0].firstName;
        }

        var lastSeen = new Date(this.props.logins[0].lastLogin);
        return name + ', last login: ' + lastSeen.toLocaleDateString();
    }

    getProgress = () => {
        return (<Grid.Row>
            
        </Grid.Row>)
    }

    isLoadingData = () => {
        return (this.state.activity2DtosDownloaded == false || this.state.mealDtosDownloaded == false ||
            this.state.clientDownloaded == false || this.state.macrosPlanDtosDownloaded == false) 
    }

    getGraphData = (measureType: string) => {
        var carbs: number = 0;
        var protein: number = 0;
        var fat: number = 0;

        if (!isNullOrUndefined(this.state.graphActivityValues.carbs) && this.state.graphActivityValues.carbs.length > 0) {
            if (!isNaN(this.state.graphActivityValues.carbs[0]) && !isNullOrUndefined(this.state.graphActivityValues.carbs[0])) {
                carbs = this.state.graphActivityValues.carbs[0];
                //console.log(carbs);
            }
        }

        if (!isNullOrUndefined(this.state.graphActivityValues.protein) && this.state.graphActivityValues.protein.length > 0) {
            if (!isNaN(this.state.graphActivityValues.protein[0]) && !isNullOrUndefined(this.state.graphActivityValues.protein[0])) {
                protein = this.state.graphActivityValues.protein[0];
                //console.log(protein);
            }
        }

        if (!isNullOrUndefined(this.state.graphActivityValues.fat) && this.state.graphActivityValues.fat.length > 0) {
            if (!isNaN(this.state.graphActivityValues.fat[0]) && !isNullOrUndefined(this.state.graphActivityValues.fat[0])) {
                fat = this.state.graphActivityValues.fat[0];
                //console.log(fat);
            }
        }
        return { labels: ['Carb', 'Protein', 'Fat'], series: [carbs, protein, fat] };
    }

    getFirstValue = (values: number[]) => {
        var result: number = 0;
        if (!isNullOrUndefined(values) && values.length > 0) {
            if (!isNaN(values[0]) && !isNullOrUndefined(values[0])) {
                result = values[0];
                console.log(result);
            }
        }

        return result;
    }

    getGraphMacroData = (values: number[]) => {
        var value: number = 0;
        value = this.getFirstValue(values);
        var remaining: number = 0;
        if (value < 100) {
            remaining = 100 - value;
        }

        return { labels: [value.toFixed(1), remaining.toFixed(1)], series: [value, remaining] };
    }

    setActivityGraphValues = () => {
        if (this.state.graphActivityValues.steps.length == this.state.activity2Dtos.length &&
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
            if (index === 0 || index === arr.length - 1) {
                this.state.activityLabel.push((new Date(m.created)).toLocaleDateString().slice(0, 5));
            }
            else {
                this.state.activityLabel.push('');
            }

            this.state.graphActivityValues.steps.push(m.steps);
            this.state.graphActivityValues.calories.push(m.calories);
            this.state.graphActivityValues.maxHr.push(m.maxHr);
            index++;
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
            const client = this.state.clientDtos[0];
            const macrosPlan = this.state.macrosPlanDtos[0];
            const bmr = (10 * macrosPlan.weight) + (6.25 * macrosPlan.height) - (5 * client.age) - 161;
            const totalCalories = getActivityLevel(macrosPlan.activityLevel) * bmr;
            const carb = ((macrosPlan.carbPercent / 100.0 * totalCalories) / 4).toFixed(2);
            const protein = ((macrosPlan.proteinPercent / 100.0 * totalCalories) / 4).toFixed(2);
            const fat = ((macrosPlan.fatPercent / 100.0 * totalCalories) / 9).toFixed(2);

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

    resetGraphData = () => {
        this.state.graphActivityValues.bodyFats = [];
        this.state.graphActivityValues.calories = [];
        this.state.graphActivityValues.carbs = [];
        this.state.graphActivityValues.fat = [];
        this.state.graphActivityValues.protein = [];
        this.state.graphActivityValues.steps = [];
        this.state.graphActivityValues.weights = [];
        this.setState({
            graphActivityValues: this.state.graphActivityValues, activity2DtosUpdated: false, activity2DtosDownloaded: false,
            mealDtosDownloaded: false, mealDtosUpdated: false, activity2Dtos: [], mealDtos: []
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

    getStatistics = () => {
        return (<Statistic.Group size='tiny'>
            <Statistic color={getStepIndicatorColour(this.state.graphActivityValues.steps[0] / this.state.guides.steps)}>
                <Statistic.Value>{this.state.graphActivityValues.steps[0]}</Statistic.Value>
                <Statistic.Label>Steps</Statistic.Label>
            </Statistic>
            <Statistic color={getIndicatorColour(this.state.graphActivityValues.calories[0] / this.state.guides.calories)}>
                <Statistic.Value>{this.state.graphActivityValues.calories[0]}</Statistic.Value>
                <Statistic.Label>Burned Calories</Statistic.Label>
            </Statistic>
            <Statistic color={getMaxHrColour(this.state.graphActivityValues.maxHr[0], this.state.clientDtos[0].age)}>
                <Statistic.Value>{this.state.graphActivityValues.maxHr[0]}</Statistic.Value>
                <Statistic.Label>Max HR</Statistic.Label>
            </Statistic>
        </Statistic.Group>);
    }

    getMacroIndicatorIcon = (values: number[]) => {
        var value = this.getFirstValue(values);
        if (value < 10.0) {
            return (<Icon name='arrow down' size='large' color='orange' />)
        }

        if (value < 80.0) {
            return (<Icon name='thumbs up' size='large' color='green' />)
        }

        if (value > 100.0) {
            return (<Icon name='exclamation triangle' size='large' color='red' />)
        }
    }

    getProteinIndicatorIcon = (values: number[]) => {
        var value = this.getFirstValue(values);
        if (value < 50.0) {
            return (<Icon name='arrow down' size='large' color='orange' />)
        }

        return (<Icon name='thumbs up' size='large' color='green' />)
    }

    render() {
        var divLoaderStyle = {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        };

        if (this.props.logins.length > 0) {
            if (this.state.apiUpdate === true) {
                this.setState({ apiUpdate: false, clientDownloaded: true});
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

            if (this.isLoadingData()) {
                return (<div style={divLoaderStyle}>
                    <Dimmer active inverted>
                        <Loader content='Loading' />
                    </Dimmer>
                </div>);
            }

            this.setActivityGraphValues();

            var options2 = {
                reverseData: true,
                donut: true,
                donutWidth: 30,
                startAngle: 270,
                showLabel: true,
                total: 200
            };

            var divLabelStyle = {
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                color: '#fffafa',
                backgroundColor: 'black'
            };

        return (
            <div>
                <Grid centered>
                    <Grid.Row>
                        <Grid.Column width={16}>
                            <AppsMenu activeItem='home' logins={this.props.logins} clientDtos={this.state.clientDtos} />
                            <Divider />
                        </Grid.Column>
                        <Grid.Column width={16} textAlign='left'>
                            <Image avatar src={this.getPhotoProfile()} />
                            <a>{this.getUserInfo()}</a>
                            {this.getFlag(this.state.clientDtos[0].city)}
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row textAlign='center'>
                        <Grid.Column width={16} textAlign='center'>
                            <h2>Today's Summary...</h2>
                        </Grid.Column>
                        <Grid.Column width={16} textAlign='center'>
                            <Segment>
                                <div style={divLoaderStyle}>
                                    {this.getStatistics()}
                                </div>
                            </Segment>
                        </Grid.Column>
                        <Grid.Column width={16} textAlign='center'>
                            <Segment>
                                <span>
                                    <a>Macros Consumptions </a>
                                    <a style={divCarb}>col</a><a>Carb% </a><a style={divPro}>col</a><a>Protein%</a><a style={divFat}>col</a><a> Fat% </a>
                                </span>
                                <div>
                                    <ChartistGraph data={this.getGraphData('Macros')} type={bar} options={barChartOptions} />
                                </div>
                            </Segment>
                        </Grid.Column>
                        <Grid.Column width={16}>
                            <Segment textAlign='center'>
                                <span style={divLoaderStyle}>
                                    <a>Macros Indicators </a>
                                    <a style={divCarb}>col</a><a>Used% </a><a style={divPro}>col</a><a>Balance%</a>
                                </span>
                                <Grid celled centered>
                                    <Grid.Row textAlign='center' columns={3}>
                                        <Grid.Column textAlign='center'>
                                            <ChartistGraph data={this.getGraphMacroData(this.state.graphActivityValues.carbs)} type='Pie' options={options2} />
                                            {this.getMacroIndicatorIcon(this.state.graphActivityValues.carbs)}<span> carbs</span>
                                        </Grid.Column>
                                        <Grid.Column textAlign='center'>
                                            <ChartistGraph data={this.getGraphMacroData(this.state.graphActivityValues.protein)} type='Pie' options={options2} />
                                            {this.getProteinIndicatorIcon(this.state.graphActivityValues.protein)}<span> protein</span>
                                        </Grid.Column>
                                        <Grid.Column textAlign='center'>
                                            <ChartistGraph data={this.getGraphMacroData(this.state.graphActivityValues.fat)} type='Pie' options={options2} />
                                            {this.getMacroIndicatorIcon(this.state.graphActivityValues.fat)}<span> fat</span>
                                        </Grid.Column>
                                    </Grid.Row>
                                </Grid>
                                <span style={divLoaderStyle}>
                                    <div>
                                        <Icon name='thumbs up' size='large' color='green' /><a>Good</a>
                                    </div>
                                    <div>
                                        <Icon name='arrow down' size='large' color='orange' /><a>Too Low</a>
                                    </div>
                                    <div>
                                        <Icon name='exclamation triangle' size='large' color='red' /><a>Too High</a>
                                    </div>
                                </span>
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
)(DashboardDaily as any);