import * as React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';
import { Menu, Segment, Grid, Dimmer, Label, Loader, Image, List, Flag, Dropdown, Divider, Statistic, Icon } from 'semantic-ui-react'
import { ApplicationState } from '../store';
import * as LoginStore from '../store/Login';
import { IMacroGuides, IMacrosPlanDto, IMealDto, IMeals } from '../models/meals';
import { IActivityGuides, IActivityDto, getStepIndicatorColour, getIndicatorColour, getMaxHrColour, IActivity } from '../models/activities'
import { getActivityLevel } from '../models/activities';
import { IMeasurements, IMeasurementDto, IGraphMeasurements, calcBodyFatPercent, getBodyFatIndicator, getColour, getBodyfatForeColour } from '../models/measurement';
import CaloriesRemainingHeader from './CaloriesRemainingHeader'
import ChartistGraph from 'react-chartist';
import AppsMenu from './AppMenus';
import { isNull, isNullOrUndefined } from 'util';
import {
    Card,
    Metric,
    Text,
    Flex,
    BadgeDelta,
    ColGrid,
} from '@tremor/react';
import { AreaChart } from "@tremor/react";
import { Datepicker } from "@tremor/react";
import './signin.css';

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
    meals: IMeals;
    mealDtos: IMealDto[];
    mealDtosUpdated: boolean;
    mealDtosDownloaded: boolean;
    activities: IActivity[];
    activity2Dtos: IActivityDto[];
    activity2DtosUpdated: boolean;
    activity2DtosDownloaded: boolean;
    latestMeasurementDtos: IMeasurementDto[];
    latestMeasurementDtosUpdated: boolean;
    latestMeasurementDtosDownloaded: boolean;
    measurementDtos: IMeasurementDto[];
    measurementDtosUpdated: boolean;
    measurementDtosDownloaded: boolean;
    weightLabel: string[];
    activityLabel: string[];
    graphActivityValues: IGraphActivity;
    queryStatus: string;
    toClientId: number;
    updateAllInfo: boolean;
    startDate: Date;
    endDate: Date;
    weightChartData: any[];
    bodyFatChartData: any[];
    dateChanged: boolean;
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

interface IMacroRow {
    title: string;
    metric: number;
    metricStr: string;
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

const dataFormatter = (number: number) => {
    return Intl.NumberFormat("us").format(number).toString() + ' kg';
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

        var startDate = new Date();
        startDate.setDate(startDate.getDate() - 15);
        startDate.setHours(0, 0, 0, 0);
        this.setState({ startDate: startDate });

        var endDate = new Date();
        endDate.setHours(0, 0, 0, 0);
        this.setState({ endDate: endDate });
        
        if (this.props.logins.length > 0) {
            var clientId = this.props.logins[0].clientId;
            
            //get client info
            fetch('api/client?clientId=' + this.props.logins[0].clientId)
                .then(response => response.json() as Promise<IClientDto[]>)
                .then(data => this.setState({
                    clientDtos: data, apiUpdate: true, updateAllInfo: false
                })).catch(error => console.log(error));

            //get all activities
            fetch('api/tracker/' + clientId + '/activity/slice?fromDate=' + today.toISOString() + '&toDate=' + today.toISOString())
                .then(response => response.json() as Promise<IActivityDto[]>)
                .then(data => this.setState({
                    activity2Dtos: data, activity2DtosUpdated: true, updateAllInfo: false
                })).catch(error => console.log(error));

            //get macros plan
            fetch('api/client/' + clientId + '/macrosplan')
                .then(response => response.json() as Promise<IMacrosPlanDto[]>)
                .then(data => this.setState({
                    macrosPlanDtos: data, macrosPlanDtosUpdated: true, updateAllInfo: false
                })).catch(error => console.log(error));

            //get all meals
            fetch('api/tracker/' + clientId + '/macrosguide/slice?fromDate=' + today.toISOString() + '&toDate=' + today.toISOString())
                .then(response => response.json() as Promise<IMealDto[]>)
                .then(data => this.setState({
                    mealDtos: data, mealDtosUpdated: true, updateAllInfo: false
                })).catch(error => console.log(error));

            // get latest measurements
            fetch('api/client/' + this.props.logins[0].clientId + '/measurements/closest?date=' + today.toISOString())
                .then(response => response.json() as Promise<IMeasurementDto[]>)
                .then(data => this.setState({
                    latestMeasurementDtos: data, latestMeasurementDtosUpdated: true, updateAllInfo: false
                })).catch(error => console.log(error));

            // get measurements
            fetch('api/client/' + this.props.logins[0].clientId + '/all/measurements?fromDate=' + startDate.toISOString() + '&date=' + endDate.toISOString())
                .then(response => response.json() as Promise<IMeasurementDto[]>)
                .then(data => this.setState({
                    measurementDtos: data, measurementDtosUpdated: true, updateAllInfo: false
                })).catch(error => console.log(error));

            this.setMeasurementsGraphValues();
        }
    }

    getAllMeasurements = () => {
        fetch('api/client/' + this.props.logins[0].clientId + '/all/measurements?fromDate=' + this.state.startDate.toISOString() + '&date=' + this.state.endDate.toISOString())
            .then(response => response.json() as Promise<IMeasurementDto[]>)
            .then(data => this.setState({
                measurementDtos: data, measurementDtosUpdated: true, updateAllInfo: false
            })).catch(error => console.log(error));
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
            meals: { 0: [], 1: [], 2: [], 3: [] },
            mealDtos: [],
            mealDtosDownloaded: false,
            mealDtosUpdated: false,
            activities: [],
            activity2Dtos: [],
            activity2DtosUpdated: false,
            activity2DtosDownloaded: false,
            weightLabel: [],
            activityLabel: [],
            graphActivityValues: { steps: [], calories: [], maxHr: [], weights: [], bodyFats: [], fat: [], carbs: [], protein: [] },
            queryStatus: 'no error',
            toClientId: 3,
            updateAllInfo: false,
            startDate: new Date(),
            endDate: new Date(),
            measurementDtos: [],
            measurementDtosDownloaded: false,
            measurementDtosUpdated: false,
            latestMeasurementDtos: [],
            latestMeasurementDtosDownloaded: false,
            latestMeasurementDtosUpdated: false,
            weightChartData: [],
            bodyFatChartData: [],
            dateChanged: false
        };
    }

    GetWeightGraph = () => (
        <AreaChart
            data={this.state.weightChartData}
            categories={["weight"]}
            dataKey="date"
            height="h-72"
            colors={["indigo"]}
            marginTop="mt-4"
            valueFormatter={dataFormatter}
        />
    );

    GetBodyFatGraph = () => (
        <AreaChart
            data={this.state.bodyFatChartData}
            categories={["bodyFat"]}
            dataKey="date"
            height="h-72"
            colors={["red"]}
            marginTop="mt-4"
        />
    );

    GetMacroDashboard = () => {
        var categories: IMacroRow[] = [];
        categories.push({ title: 'CARBS', metric: this.getFirstValue(this.state.graphActivityValues.carbs), metricStr: this.getFirstValue(this.state.graphActivityValues.carbs).toFixed(0) + '%' });
        categories.push({ title: 'PROTEIN', metric: this.getFirstValue(this.state.graphActivityValues.protein), metricStr: this.getFirstValue(this.state.graphActivityValues.protein).toFixed(0) + '%' });
        categories.push({ title: 'FAT', metric: this.getFirstValue(this.state.graphActivityValues.fat), metricStr: this.getFirstValue(this.state.graphActivityValues.fat).toFixed(0) + '%' });

        return (
            <ColGrid numColsSm={2} numColsLg={3} gapX="gap-x-6" gapY="gap-y-6">
                {categories.map((item) => (
                    <Card key={item.title}>
                        <Flex alignItems="items-start">
                            <Text>{item.title}</Text>
                            {this.getMacroIndicatorIcon2(item.metric)}
                        </Flex>
                        <Flex
                            justifyContent="justify-start"
                            alignItems="items-baseline"
                            spaceX="space-x-3"
                            truncate={true}
                        >
                            <Metric>{item.metricStr}</Metric>
                        </Flex>
                    </Card>
                ))}
            </ColGrid>
        );
    }

    GetMacroRow = (row: IMacroRow) => {
        return (
            <Card key={row.title}>
                <Flex alignItems="items-center">
                    <Text>{row.title}</Text>
                </Flex>
                <Flex
                    justifyContent="justify-center"
                    alignItems="items-center"
                    spaceX="space-x-3"
                    truncate={true}
                >
                    <Metric>{row.metricStr}</Metric>
                </Flex>
                <Flex
                    justifyContent="justify-center"
                    alignItems="items-center"
                    spaceX="space-x-3"
                    truncate={true}
                >
                    {this.getMacroIndicatorIcon2(row.metric)}
                </Flex>
            </Card>
        );
    }

    getWeightDelta = () => {
        var delta = this.state.macrosPlanDtos[0].weight - this.state.latestMeasurementDtos[0].weight;
        return delta.toPrecision(2);
    }

    getWeightDeltaType = () => {
        var delta = this.state.macrosPlanDtos[0].weight - this.state.latestMeasurementDtos[0].weight;

        if (delta > 0.0) {
            return 'moderateIncrease'
        }

        return 'moderateDecrease'
    }

    GetWeightMetric = () => {
        return (
            <Card key="Weight">
                <Flex alignItems="items-start">
                    <Text>WEIGHT</Text>
                    <BadgeDelta deltaType={this.getWeightDeltaType()} text={this.getWeightDelta()} />
                </Flex>
                <Flex
                    justifyContent="justify-start"
                    alignItems="items-baseline"
                    spaceX="space-x-3"
                    truncate={true}
                >
                    <Metric>{this.state.latestMeasurementDtos[0].weight}</Metric>
                    <Text truncate={true}>
                        from
                        {' '}
                        {this.state.macrosPlanDtos[0].weight}
                    </Text>
                </Flex>
            </Card>
        );
    }

    GetStepMetric = () => {
        return (
            <Card key="Steps">
                <Flex alignItems="items-center">
                    <Text>STEPS</Text>
                </Flex>
                <Flex
                    justifyContent="justify-center"
                    alignItems="items-center"
                    spaceX="space-x-3"
                    truncate={true}
                >
                    <Metric color={getStepIndicatorColour(this.state.graphActivityValues.steps[0] / this.state.guides.steps)}>{this.state.graphActivityValues.steps[0]}</Metric>
                </Flex>
            </Card>
        );
    }

    GetCaloriesMetric = () => {
        return (
            <Card key="Calories">
                <Flex alignItems="items-center">
                    <Text>CALORIES</Text>
                </Flex>
                <Flex
                    justifyContent="justify-center"
                    alignItems="items-center"
                    spaceX="space-x-3"
                    truncate={true}
                >
                    <Metric color={getIndicatorColour(this.state.graphActivityValues.calories[0] / this.state.guides.calories)}>{this.state.graphActivityValues.calories[0]}</Metric>
                </Flex>
            </Card>
        );
    }

    GetMaxHrMetric = () => {
        return (
            <Card key="MAXHR">
                <Flex alignItems="items-center">
                    <Text>MAX HR</Text>
                </Flex>
                <Flex
                    justifyContent="justify-center"
                    alignItems="items-center"
                    spaceX="space-x-3"
                    truncate={true}
                >
                    <Metric color={getMaxHrColour(this.state.graphActivityValues.maxHr[0], this.state.clientDtos[0].age)}>{this.state.graphActivityValues.maxHr[0]}</Metric>
                </Flex>
            </Card>
        );
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

        if (country === 'bn') {
            return (<Flag name='bn' />)
        }

        if (country === 'sg') {
            return (<Flag name='sg' />)
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
            this.state.clientDownloaded == false || this.state.macrosPlanDtosDownloaded == false ||
            this.state.measurementDtosDownloaded == false || this.state.latestMeasurementDtosDownloaded == false) 
    }

    getGraphData = (measureType: string) => {
        var carbs: number = 0;
        var protein: number = 0;
        var fat: number = 0;

        if (!isNullOrUndefined(this.state.graphActivityValues.carbs) && this.state.graphActivityValues.carbs.length > 0) {
            if (!isNaN(this.state.graphActivityValues.carbs[0]) && !isNullOrUndefined(this.state.graphActivityValues.carbs[0])) {
                carbs = this.state.graphActivityValues.carbs[0];
            }
        }

        if (!isNullOrUndefined(this.state.graphActivityValues.protein) && this.state.graphActivityValues.protein.length > 0) {
            if (!isNaN(this.state.graphActivityValues.protein[0]) && !isNullOrUndefined(this.state.graphActivityValues.protein[0])) {
                protein = this.state.graphActivityValues.protein[0];
            }
        }

        if (!isNullOrUndefined(this.state.graphActivityValues.fat) && this.state.graphActivityValues.fat.length > 0) {
            if (!isNaN(this.state.graphActivityValues.fat[0]) && !isNullOrUndefined(this.state.graphActivityValues.fat[0])) {
                fat = this.state.graphActivityValues.fat[0];
            }
        }
        return { labels: ['Carb', 'Protein', 'Fat'], series: [carbs, protein, fat] };
    }

    getFirstValue = (values: number[]) => {
        var result: number = 0;
        if (!isNullOrUndefined(values) && values.length > 0) {
            if (!isNaN(values[0]) && !isNullOrUndefined(values[0])) {
                result = values[0];
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

    getMacroIndicatorIcon2 = (value: number) => {
        if (value < 10.0) {
            return (<div><Icon name='arrow down' size='large' color='orange' /><div>Too Low</div></div>)
        }

        if (value < 80.0) {
            return (<div><Icon name='thumbs up' size='large' color='green' /><div>Good</div></div>)
        }

        if (value > 80.0 && value < 100.0) {
            return (<div><Icon name='exclamation triangle' size='large' color='orange' /><div>Cautious</div></div >)
        }

        if (value > 100.0) {
            return (<div><Icon name='exclamation triangle' size='large' color='red' /><div>Too High</div></div>)
        }
    }

    getGraph = () => {
        let data = this.getGraphData('Macros');
        if (data.series.length > 2 && (data.series[0] > 0 || data.series[1] > 0 || data.series[2] > 0)) {
            return (<Segment>
                <span>
                    <a>Macros Consumptions </a>
                    <a style={divCarb}>col</a><a>Carb% </a><a style={divPro}>col</a><a>Protein%</a><a style={divFat}>col</a><a> Fat% </a>
                </span>
                <div>
                    <ChartistGraph data={data} type={bar} options={barChartOptions} />
                </div>
            </Segment>);
        }
        else {
            return (<Segment inverted>
                <h4>NO DAILY MACROS RECORDED TODAY</h4>
            </Segment>);
        }
    }

    getMealTypeIndex = (type: number) => {
        if (type == 1) {
            return 1;
        }
        if (type == 2) {
            return 2;
        }
        if (type == 3) {
            return 3;
        }

        return 0;
    }

    getMealType = (type: string) => {
        if (type == 'Lunch') {
            return 1;
        }
        if (type == 'Dinner') {
            return 2;
        }
        if (type == 'Snack') {
            return 3;
        }

        return 0;
    }

    setMeals = () => {
        if (this.state.mealDtos.length > 0) {

            var totalMeals = 0;
            for (let i = 0; i < 4; i++) {
                totalMeals += this.state.meals[this.getMealTypeIndex(i)].length;
            }

            if (totalMeals === this.state.mealDtos.length) {
                return;
            }

            this.state.mealDtos.forEach(meal => {
                this.state.meals[this.getMealType(meal.mealType)].push({ id: meal.id, food: meal.food, carb: meal.carb, protein: meal.protein, fat: meal.fat, portion: meal.portion, fv: meal.fv, photo: meal.photo, check: false, remove: false });
            })

            this.setState({ meals: this.state.meals });
        }
    }

    setActivities = () => {
        if (this.state.activity2Dtos.length > 0) {

            if ((this.state.activities.filter(x => x.id > 0)).length === this.state.activity2Dtos.length) {
                return;
            }

            var activities: IActivity[] = [];
            this.state.activity2Dtos.forEach(activity => {
                if (activity.description !== 'sleeps' && activity.description !== 'steps') {
                    activities.push({ id: activity.id, activityDesc: activity.description, calories: activity.calories, steps: activity.steps, maxHr: activity.maxHr, duration: activity.duration, check: false });
                }
            })

            this.setState({ activities: activities });
        }
    }

    setMeasurementsGraphValues = () => {
        var weightChartData:any[] = [];
        var bodyFatChartData:any[] = [];
        var index: number = 0;
        var arr = this.state.measurementDtos.sort((a: IMeasurementDto, b: IMeasurementDto) => {
            return (new Date(a.created)).getTime() - (new Date(b.created)).getTime();

        });

        arr.forEach(m => {
            var date = new Date(m.created);
            date.setHours(date.getHours() + 24);
            var label = date.toLocaleDateString().slice(0, 5);
            weightChartData.push({ date: label, weight: m.weight });
            const bodyFatPercent = (m.waist + m.hips - m.neck) / 2;
            bodyFatChartData.push({ date: label, bodyFat: bodyFatPercent });
            index++;
        });

        this.setState({ weightChartData: weightChartData, bodyFatChartData: bodyFatChartData });
    }

    handleDateChange = (start: any, end: any) => {
        this.setState({ dateChanged: true, startDate: start, endDate: end });
    }

    render() {
        var divLoaderStyle = {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        };

        if (this.props.logins.length > 0) {
            if (this.state.dateChanged === true) {
                this.setState({ dateChanged: false, measurementDtosUpdated: false, updateAllInfo: true });
                this.getAllMeasurements();
            }

            if (this.state.apiUpdate === true) {
                this.setState({ apiUpdate: false, clientDownloaded: true});
            }

            if (this.state.activity2DtosUpdated === true) {
                this.setState({ activity2DtosUpdated: false, activity2DtosDownloaded: true });
            }

            if (this.state.mealDtosUpdated === true) {
                this.setState({ mealDtosDownloaded: true, mealDtosUpdated: false });
            }

            if (this.state.latestMeasurementDtosUpdated === true) {
                this.setState({ latestMeasurementDtosDownloaded: true, latestMeasurementDtosUpdated: false });
            }

            if (this.state.macrosPlanDtosUpdated === true && this.state.clientDownloaded === true) {
                this.setState({ macrosPlanDtosUpdated: false, macrosPlanDtosDownloaded: true });
                this.setMacroGuides();
            }

            if (this.state.measurementDtosUpdated === true) {
                this.setState({ measurementDtosDownloaded: true, measurementDtosUpdated: false });
            }

            if (this.isLoadingData()) {
                return (<div style={divLoaderStyle}>
                    <Dimmer active inverted>
                        <Loader content='Loading' />
                    </Dimmer>
                </div>);
            }

            if (!this.state.updateAllInfo) {
                this.setMeals();
                this.setActivities();
                this.setMeasurementsGraphValues();
                this.setState({ updateAllInfo: true });
            }
            
            this.setActivityGraphValues();

        return (
            <div>
                <Grid centered>
                    <Grid.Row>
                        <Grid.Column width={16}>
                            <AppsMenu activeParentItem='home' activeItem='home' logins={this.props.logins} clientDtos={this.state.clientDtos} />
                        </Grid.Column>
                        <Grid.Column width={16} textAlign='left'>
                            <Image avatar src={this.getPhotoProfile()} />
                            <a>{this.getUserInfo()}</a>
                            {this.getFlag(this.state.clientDtos[0].city)}
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row textAlign='center'>
                        <Grid.Column width={16} textAlign='center'>
                            <h2 className="text-signin">DAILY PROGRESS</h2>
                        </Grid.Column>
                        <Grid.Column width={16} textAlign='center'>
                            <Grid centered>
                                <Grid.Row textAlign='center' columns={3}>
                                    <Grid.Column textAlign='center'>
                                        {this.GetStepMetric()}
                                    </Grid.Column>
                                    <Grid.Column textAlign='center'>
                                        {this.GetCaloriesMetric()}
                                    </Grid.Column>
                                    <Grid.Column textAlign='center'>
                                        {this.GetMaxHrMetric()}
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row textAlign='center'>
                        <Grid.Column width={16}>
                            <Grid centered>
                                <Grid.Row textAlign='center' columns={3}>
                                    <Grid.Column textAlign='center'>
                                        {this.GetMacroRow({ title: 'CARB', metric: this.getFirstValue(this.state.graphActivityValues.carbs), metricStr: this.getFirstValue(this.state.graphActivityValues.carbs).toFixed(0) + '%' })}
                                    </Grid.Column>
                                    <Grid.Column textAlign='center'>
                                        {this.GetMacroRow({ title: 'PROTEIN', metric: this.getFirstValue(this.state.graphActivityValues.protein), metricStr: this.getFirstValue(this.state.graphActivityValues.protein).toFixed(0) + '%' })}
                                    </Grid.Column>
                                    <Grid.Column textAlign='center'>
                                        {this.GetMacroRow({ title: 'FAT', metric: this.getFirstValue(this.state.graphActivityValues.fat), metricStr: this.getFirstValue(this.state.graphActivityValues.fat).toFixed(0) + '%' })}
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row textAlign='center'>
                        <Grid.Column width={16}>
                            <Datepicker
                                placeholder="Select..."
                                enableRelativeDates={false}
                                enableYearPagination={false}
                                handleSelect={this.handleDateChange}
                                defaultStartDate={this.state.startDate}
                                defaultEndDate={this.state.endDate}
                                defaultRelativeFilterOption={null}
                                minDate={null}
                                maxDate={null}
                                color="blue"
                                maxWidth="max-w-none"
                                marginTop="mt-0"
                            />
                        </Grid.Column>
                        <Grid.Column width={8}>
                            {this.GetWeightGraph()}
                        </Grid.Column>
                        <Grid.Column width={8}>
                            {this.GetBodyFatGraph()}
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </div>);
        }
        return (<Redirect to="/" />);
    }
}

export default connect(
    (state: ApplicationState) => state.logins, // Selects which state properties are merged into the component's props
    LoginStore.actionCreators // Selects which action creators are merged into the component's props
)(DashboardDaily as any);