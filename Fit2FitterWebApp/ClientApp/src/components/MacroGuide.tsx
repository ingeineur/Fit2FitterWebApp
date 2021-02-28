import * as React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';
import { Button, Segment, Grid, Menu, Label, Modal, Icon, Progress, Flag, Image } from 'semantic-ui-react'
import { ApplicationState } from '../store';
import * as LoginStore from '../store/Login';
import SemanticDatepicker from 'react-semantic-ui-datepickers';
import 'react-semantic-ui-datepickers/dist/react-semantic-ui-datepickers.css';
import MacroGuideHeader from './MacroGuideHeader'
import MacroGuideReviewModal from './MacroGuideReviewModal'
import MacroGuideTable from './MacroGuideTable'

interface IProps {
}

interface IState {
    username: string;
    password: string;
    activeItem: string;
    selectedDate: Date;
    prevDate: Date;
    guides: IMacroGuides;
    clientDtos: IClientDto[];
    macrosPlanDtos: IMacrosPlanDto[];
    mealDtos: IMealDto[];
    meals: IMeals;
    updated: boolean;
    apiUpdate: boolean;
    savingStatus: string;
    dateChanged: boolean;
    openReview: boolean;
    savingDone: boolean;
}

interface IMacroGuides {
    carb: number;
    protein: number;
    fat: number;
    fruits: number;
}

interface ITotalDailyMacro {
    carb: number;
    protein: number;
    fat: number;
    fruits: number;
}

interface IMeals {
    0: IMealDetails[];
    1: IMealDetails[];
    2: IMealDetails[];
    3: IMealDetails[];
}

interface IMealDetails {
    id: number;
    food: string;
    carb: number;
    protein: number;
    fat: number;
    fv: number;
    photo: string;
    check: boolean;
    remove: boolean;
}

interface IClientDto {
    id: number,
    lastName: string;
    firstName: string;
    address: string;
    city: string;
    age: number;
    created: string;
    avatar: string;
}

interface IMealDto {
    id: number;
    mealType: string;
    food: string;
    carb: number;
    protein: number;
    fat: number;
    fv: number;
    photo: string;
    updated: string;
    created: string;
    clientId: number;
}

interface IMacrosPlanDto {
    id: number,
    height: number,
    weight: number,
    macroType: string;
    activityLevel: string;
    carbPercent: number,
    proteinPercent: number,
    fatPercent: number,
    updated: string;
    created: string;
    clientId: number;
}

interface IMessageDto {
    id: number,
    measurementRef: string;
    mealsRef: string;
    activitiesRef: string;
    message: string;
    readStatus: boolean;
    updated: string;
    created: string;
    fromId: number;
    clientId: number;
}

// At runtime, Redux will merge together...
type LoginProps =
    IProps
    & LoginStore.LoginState // ... state we've requested from the Redux store
    & typeof LoginStore.actionCreators // ... plus action creators we've requested
    & RouteComponentProps<{ username: string, password: string }>; // ... plus incoming routing parameters

class MacroGuide extends React.Component<LoginProps, IState> {

    public componentDidMount() {
        this.props.getLogin();
        var date = new Date();
        date.setHours(0, 0, 0, 0);
        this.setState({ selectedDate: date, prevDate: date });

        if (this.props.logins.length > 0) {
            //get client info
            fetch('api/client?clientId=' + this.props.logins[0].clientId)
                .then(response => response.json() as Promise<IClientDto[]>)
                .then(data => this.setState({
                    clientDtos: data, apiUpdate: true
                })).catch(error => console.log(error));

            //get macros plan
            fetch('api/client/' + this.props.logins[0].clientId + '/macrosplan')
                .then(response => response.json() as Promise<IMacrosPlanDto[]>)
                .then(data => this.setState({
                    macrosPlanDtos: data, apiUpdate: true
                })).catch(error => console.log(error));

            //get all meals
            fetch('api/tracker/' + this.props.logins[0].clientId + '/macrosguide?date=' + date.toISOString())
                .then(response => response.json() as Promise<IMealDto[]>)
                .then(data => this.setState({
                    mealDtos: data, apiUpdate: true
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

    updateMeals = (mealType: number, meals: IMealDetails[]) => {
        this.state.meals[this.getMealTypeIndex(mealType)] = meals;
        this.setState({ meals: this.state.meals, updated: !this.state.updated });
        this.setState({ savingStatus: 'Not Saved' })
    }

    constructor(props: LoginProps) {
        super(props);
        this.updateMeals = this.updateMeals.bind(this);
        this.state = {
            username: '', password: '', activeItem: 'Breakfast',
            selectedDate: new Date(),
            prevDate: new Date(),
            guides: { carb: 0, protein: 0, fat: 0, fruits: 0 },
            meals: { 0: [], 1: [], 2: [], 3: []},
            updated: false,
            clientDtos: [],
            macrosPlanDtos: [],
            mealDtos: [],
            apiUpdate: false,
            savingStatus: 'Saved',
            dateChanged: false,
            openReview: false,
            savingDone: false
        };
    }

    handleItemClick = (e: any, { name }: any) => this.setState({ activeItem: name })

    mealTypeDict = { 'Breakfast': 0, 'Lunch': 1, 'Dinner': 2, 'Snack': 3 };

    getMealType = (type:string) =>
    {
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

    getMealTypeString = (type: number) => {
        if (type === 1) {
            return 'Lunch';
        }
        if (type === 2) {
            return 'Dinner';
        }
        if (type === 3) {
            return 'Snack';
        }

        return 'Breakfast';
    }

    getActivityLevel = (activityLevel: string) => {
        if (activityLevel == 'Sedentary') {
            return 1.2;
        }

        if (activityLevel == 'Lightly Active') {
            return 1.375;
        }

        if (activityLevel == 'Moderately Active') {
            return 1.55;
        }

        if (activityLevel == 'Very Active') {
            return 1.725;
        }

        if (activityLevel == 'Extra Active') {
            return 1.9;
        }

        return 0;
    }

    setMacroGuides = () => {
        if (this.state.macrosPlanDtos.length > 0 && this.state.clientDtos.length > 0) {
            const client = this.state.clientDtos[0];
            const macrosPlan = this.state.macrosPlanDtos[0];
            const bmr = (10 * macrosPlan.weight) + (6.25 * macrosPlan.height) - (5 * client.age) - 161;
            const totalCalories = this.getActivityLevel(macrosPlan.activityLevel) * bmr;
            const carb = ((macrosPlan.carbPercent / 100.0 * totalCalories) / 4).toFixed(2);
            const protein = ((macrosPlan.proteinPercent / 100.0 * totalCalories) / 4).toFixed(2);
            const fat = ((macrosPlan.fatPercent / 100.0 * totalCalories) / 9).toFixed(2);

            this.state.guides.carb = parseFloat(carb);
            this.state.guides.protein = parseFloat(protein);
            this.state.guides.fat = parseFloat(fat);
            this.state.guides.fruits = 4;
            this.setState({ guides: this.state.guides });
        }
    }

    deleteMeals = () => {
        var removedMeals: IMealDetails[] = [];
        for (let i = 0; i < 4; i++) {
            var meals = this.state.meals[this.getMealTypeIndex(i)].filter(x => x.remove === true && x.id !== 0);
            removedMeals.push(...meals);
        }

        removedMeals.forEach(meal => {
            this.setState({ savingStatus: 'Saving in progress' })
            var fetchStr = 'api/tracker/' + meal.id + '/macrosguide/delete';
            fetch(fetchStr, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            }).then(response => response.json()).then(data => this.setState({ savingStatus: 'Saving in progress' })).catch(error => console.log('delete meals---------->' + error));
        });
    }

    saveMacrosGuide = () => {
        var fetchStr = 'api/tracker/macrosguides?dateString=' + this.state.selectedDate.toISOString();
        var newMealDtos: IMealDto[] = [];
        for (let i = 0; i < 4; i++) {
            var meals = this.state.meals[this.getMealTypeIndex(i)].filter(x => x.remove === false);
            meals.forEach(x => {
                newMealDtos.push({
                    id: x.id,
                    food: x.food,
                    mealType: this.getMealTypeString(i),
                    carb: parseFloat(x.carb.toString()),
                    protein: parseFloat(x.protein.toString()),
                    fat: parseFloat(x.fat.toString()),
                    fv: parseFloat(x.fv.toString()),
                    photo: x.photo,
                    created: this.state.selectedDate.toISOString(),
                    updated: (new Date()).toISOString(),
                    clientId: this.props.logins[0].clientId
                });
            });
        }

        fetch(fetchStr, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newMealDtos)
        }).then(response => response.json()).then(data => this.setState({ savingStatus: 'Saved', savingDone: true })).catch(error => console.log('save  ---------->' + error));
    }

    updateMacrosGuide = () => {
        this.setState({ savingStatus: 'Saving in progress' })
        var fetchStr = 'api/tracker/macrosguides/update?dateString=' + this.state.selectedDate.toISOString();

        var newMealDtos: IMealDto[] = [];
        for (let i = 0; i < 4; i++) {
            var meals = this.state.meals[this.getMealTypeIndex(i)].filter(x => x.remove === false && x.id !== -1);
            meals.forEach(x => {
                newMealDtos.push({
                    id: x.id,
                    food: x.food,
                    mealType: this.getMealTypeString(i),
                    carb: parseFloat(x.carb.toString()),
                    protein: parseFloat(x.protein.toString()),
                    fat: parseFloat(x.fat.toString()),
                    fv: parseFloat(x.fv.toString()),
                    photo: x.photo,
                    created: this.state.selectedDate.toISOString(),
                    updated: (new Date()).toISOString(),
                    clientId: this.props.logins[0].clientId
                });
            });
        }

        fetch(fetchStr, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newMealDtos)
        }).then(response => response.json()).then(data => this.setState({ savingStatus: 'Saved' })).catch(error => console.log('put macros ---------->' + error));
    }

    logMeals = () => {
        var fetchStr = 'api/tracker/comment?date=' + this.state.selectedDate.toISOString();
        fetch(fetchStr, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: 0,
                measurementRef: 0,
                mealsRef: 1,
                activitiesRef: 0,
                readStatus: false,
                message: 'Log meals for today',
                created: this.state.selectedDate.toISOString(),
                updated: (new Date()).toISOString(),
                fromId: this.props.logins[0].clientId,
                clientId: 2,
            })
        }).then(response => response.json()).then(data => this.setState({ updated: !this.state.updated })).catch(error => console.log('put macros ---------->' + error));
    }

    onSave = () => {
        this.setState({ savingStatus: 'Saving in progress' })

        // delete rows
        this.deleteMeals();

        // add rows
        setTimeout(() => {
            this.saveMacrosGuide();
            this.logMeals();
        }, 2000);
    }

    getMeals = () => {
        fetch('api/tracker/' + this.props.logins[0].clientId + '/macrosguide?date=' + this.state.selectedDate.toISOString())
            .then(response => response.json() as Promise<IMealDto[]>)
            .then(data => this.setState({
                mealDtos: data, apiUpdate: true
            })).catch(error => console.log(error));
    }

    resetMeals = () => {
        this.setState({
            meals: { 0: [], 1: [], 2: [], 3: [] } });
    }

    handleDateChange = (event: any, field: any) => {
        var newDate = new Date(field['value']);
        var dayDiff = Math.abs((this.state.prevDate.getTime() - newDate.getTime()) / (1000 * 3600 * 24));
        if (dayDiff < 356) {
            this.setState({ prevDate: this.state.selectedDate });
            this.setState({ selectedDate: new Date(field['value']), mealDtos: [], dateChanged: true, apiUpdate: true })
        }
    }

    handlePrevDate = (e: any) => {
        var prevDate = new Date(this.state.selectedDate);
        var date = new Date(this.state.selectedDate);
        var day = this.state.selectedDate.getDate();
        var month = this.state.selectedDate.getMonth();
        var year = this.state.selectedDate.getFullYear();
        
        date.setDate(day - 1);
        date.setHours(0, 0, 0, 0);

        //console.log('selected: ' + this.state.selectedDate.toDateString())
        //console.log('selected: ' + day + ',' + month + ',' + year)

        //console.log('adjusted: ' + date.toDateString())
        //console.log('adjusted: ' + date.getDate() + ',' + date.getMonth() + ',' + date.getFullYear())

        if (date.getDate() > day) {
            date.setMonth(month - 1);
            //console.log('adjusted 2: ' + date.getDate() + ',' + date.getMonth() + ',' + date.getFullYear())
        }

        if (date.getMonth() > month) {
            date.setFullYear(year - 1);
            //console.log('adjusted 3: ' + date.getDate() + ',' + date.getMonth() + ',' + date.getFullYear())
        }

        this.setState({ selectedDate: new Date(date), mealDtos: [], prevDate: prevDate, dateChanged: true, apiUpdate: true });
    }

    handleNextDate = (e: any) => {
        var prevDate = new Date(this.state.selectedDate);
        var date = new Date(this.state.selectedDate);
        var day = this.state.selectedDate.getDate();
        var month = this.state.selectedDate.getMonth();
        var year = this.state.selectedDate.getFullYear();

        date.setDate(day + 1);
        date.setHours(0, 0, 0, 0);

        //console.log('selected: ' + this.state.selectedDate.toDateString())
        //console.log('selected: ' + day + ',' + month + ',' + year)

        //console.log('adjusted: ' + date.toDateString())
        //console.log('adjusted: ' + date.getDate() + ',' + date.getMonth() + ',' + date.getFullYear())
        
        if (date.getDate() < day) {
            date.setMonth(month + 1);
            //console.log('adjusted 2: ' + date.getDate() + ',' + date.getMonth() + ',' + date.getFullYear())
        }

        if (date.getMonth() < month) {
            date.setFullYear(year + 1);
            //console.log('adjusted 3: ' + date.getDate() + ',' + date.getMonth() + ',' + date.getFullYear())
        }

        this.setState({ selectedDate: new Date(date), mealDtos: [], prevDate: prevDate, dateChanged: true, apiUpdate: true });
    }

    handleOpen = (open: boolean) => {
        this.setState({ openReview: open });
    }

    getColour = () => {
        if (this.state.savingStatus === 'Not Saved') {
            return 'red';
        }

        return 'green';
    }

    getSaveIcon = () => {
        if (this.state.savingStatus === 'Not Saved') {
            return 'edit outline';
        }

        return 'save';
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
                this.state.meals[this.getMealType(meal.mealType)].push({ id: meal.id, food: meal.food, carb: meal.carb, protein: meal.protein, fat: meal.fat, fv: meal.fv, photo: meal.photo, check: false, remove: false });
            })

            this.setState({ meals: this.state.meals });
        }
    }

    onCancel = () => {
        this.resetMeals();
        this.getMeals();
        this.setState({ savingStatus: 'Saved' });
    }

    showProgressBar = () => {
        if (this.state.savingStatus == 'Saving in progress') {
            return (<Progress inverted color='green' percent={100} active={this.state.savingStatus === 'Saving in progress'} />);
        }
    }

    getFlag = () => {
        if (this.state.clientDtos.length > 0) {
            var country = this.state.clientDtos[0].city;
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
    }

    getUserInfo = () => {
        var name = ""
        if (this.state.clientDtos.length > 0) {
            var name = this.state.clientDtos[0].firstName;
        }

        var lastSeen = new Date(this.props.logins[0].lastLogin);
        return name + ', last login: ' + lastSeen.toLocaleDateString();
    }

    getPhoto = () => {
        if (this.state.clientDtos.length > 0) {
            var img = this.state.clientDtos[0].avatar;
            if (img != '') {
                return '/images/avatars/' + img;
            }
        }

        return 'https://react.semantic-ui.com/images/avatar/small/rachel.png';
    }

    render() {
        var divLabelStyle = {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: '#fffafa',
            backgroundColor: this.getColour()
        };

        var divTitleStyle = {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: 'black',
            backgroundColor: 'pink'
        };

        var divDateStyle = {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        };

        const activeItem = this.state.activeItem;
        if (this.props.logins.length > 0) {
            if (this.state.savingDone === true) {
                this.setState({ savingDone: false });
                this.resetMeals();
                this.getMeals();
            }

            if (this.state.dateChanged === true) {
                this.setState({ dateChanged: false });
                this.resetMeals();
                this.getMeals();
            }

            if (this.state.apiUpdate === true) {
                this.setState({ apiUpdate: false, updated: !this.state.updated, savingStatus: 'Info Updated' });
                this.setMacroGuides();
                this.setMeals();
            }

            return (
                <div>
                    <Grid centered>
                        <Grid.Row columns={2}>
                            <Grid.Column width={6}>
                                <Label size='large' as='a' color='pink' basic circular>Daily Meals Tracker</Label>
                            </Grid.Column>
                            <Grid.Column width={10} textAlign='right'>
                                <Image avatar src={this.getPhoto()} />
                                <a>{this.getUserInfo()}</a>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column verticalAlign='middle'>
                                <Segment color='grey' inverted attached='top'>
                                    <div style={divDateStyle}>
                                        <Button color='grey' className='prev' onClick={this.handlePrevDate} inverted attached='left' basic icon='chevron left'/>
                                            <SemanticDatepicker value={this.state.selectedDate} date={new Date()} onChange={this.handleDateChange} showToday />
                                        <Button color='grey' className='next' onClick={this.handleNextDate} inverted attached='right' basic icon='chevron right'/>
                                    </div>
                                    <Label corner='right' color={this.getColour()} icon><Icon name={this.getSaveIcon()} /></Label>
                                </Segment>
                                <Segment textAlign='center' attached='bottom'>
                                    <MacroGuideHeader meals={this.state.meals} guides={this.state.guides} update={this.state.updated} />
                                </Segment>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column width={16}>
                                <Menu attached='top' tabular compact>
                                    <Menu.Item
                                        name='Breakfast'
                                        active={activeItem === 'Breakfast'}
                                        onClick={this.handleItemClick}
                                    />
                                    <Menu.Item
                                        name='Lunch'
                                        active={activeItem === 'Lunch'}
                                        onClick={this.handleItemClick}
                                    />
                                    <Menu.Item
                                        name='Dinner'
                                        active={activeItem === 'Dinner'}
                                        onClick={this.handleItemClick}
                                    />
                                    <Menu.Item
                                        name='Snack'
                                        active={activeItem === 'Snack'}
                                        onClick={this.handleItemClick}
                                    />
                                </Menu>

                                <Segment attached='bottom'>
                                    <Grid.Column stretched width={16}>
                                        <MacroGuideTable update={this.state.updated} client={this.state.clientDtos[0]} meals={this.state.meals[this.getMealType(activeItem)]} updateMeals={this.updateMeals} mealType={this.getMealType(this.state.activeItem)} />
                                    </Grid.Column>
                                </Segment>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column textAlign='left' floated='left'>
                                <Button.Group floated='left' fluid>
                                    <Button floated='left' size='tiny' onClick={this.onCancel} secondary>Cancel</Button>
                                    <Button floated='left' size='tiny' onClick={this.onSave} primary>Save</Button>
                                    <Modal
                                        open={this.state.openReview}
                                        onClose={() => this.handleOpen(false)}
                                        onOpen={() => this.handleOpen(true)}
                                        trigger={<Button basic color='pink' size='tiny'>Review</Button>}>
                                        <Modal.Header>Meals Summary for {this.state.selectedDate.toLocaleDateString()}</Modal.Header>
                                        <Modal.Content scrolling>
                                            <Modal.Description>
                                                <MacroGuideReviewModal senderId={this.props.logins[0].clientId} clientId={this.props.logins[0].clientId} mealDate={this.state.selectedDate.toISOString()} update={this.state.updated} />
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
                    {this.showProgressBar()}
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
)(MacroGuide as any);