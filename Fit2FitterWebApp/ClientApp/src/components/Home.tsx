import * as React from 'react';
import { connect } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';
import { Button, Form, Input, Grid, Icon, Menu, Dropdown, Modal, Label, Image, Loader, Dimmer, Divider, Segment } from 'semantic-ui-react'
import { ApplicationState } from '../store';
import * as LoginStore from '../store/Login';
import { IVersion, UpdateVersionText, DivRequireUpdateLabelStyle, CurrentVersion } from '../models/version';
import { requireVersionUpdate } from '../services/utilities'
import AdminResetPwd from './AdminResetPwd';
import './signin.css';

interface IProps {
}

interface IState {
    username: string;
    password: string;
    activeItem: string;
    error: string;
    login: string;
    checkMail: boolean;
    unReadMessage: number;
    unReadMessageMeals: number;
    unReadMessageMeasurements: number;
    messageDtos: IMessageDto[];
    messagesUpdated: boolean;
    messageMealsDtos: IMessageDto[];
    mealMessagesUpdated: boolean;
    messageMeasurementsDtos: IMessageDto[];
    measurementMessagesUpdated: boolean;
    clientDtos: IClientDto[];
    clientList: IOption[],
    clientUpdated: boolean;
    toClientId: number;
    checkClients: boolean;
    loginDtos: LoginDto[];
    versionDto: IVersion;
    version: IVersion;
    apiVersionUpdate: boolean;
    openResetPwd: boolean;
    fetchAllData: boolean;
}

interface LoginDto {
    id: number,
    username: string;
    password: string;
    active: boolean;
    lastLogin: string;
    clientId: number;
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

interface IOption {
    key: string,
    text: string,
    value: string
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

var divLabelStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
};

var divWarningLabelStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'red'
};

var divFooterStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#FFFFFF',
    backgroundColor: '#382c2d'
};

// At runtime, Redux will merge together...
type LoginProps =
    IProps
    & LoginStore.LoginState // ... state we've requested from the Redux store
    & typeof LoginStore.actionCreators // ... plus action creators we've requested
    & RouteComponentProps<{ username: string, password: string }>; // ... plus incoming routing parameters
    
class Home extends React.Component<LoginProps, IState > {

    fetchAllData = () => {
        if (this.props.logins[0].username === 'admin2') {
            //get all clients for admin2 only
            fetch('api/client/all')
                .then(response => response.json() as Promise<IClientDto[]>)
                .then(data => {
                    var clientsList: IOption[] = [];
                    data.forEach(client => {
                        clientsList.push({ key: client.id.toString(), text: client.firstName, value: client.id.toString() });
                    });

                    this.setState({
                        clientDtos: data, clientUpdated: true, clientList: clientsList
                    })
                }).catch(error => console.log(error));
        }
        else {
            //get client info
            fetch('api/client?clientId=' + this.props.logins[0].clientId)
                .then(response => response.json() as Promise<IClientDto[]>)
                .then(data => this.setState({
                    clientDtos: data, clientUpdated: true
                })).catch(error => console.log(error));
        }

        fetch('api/tracker/' + this.props.logins[0].clientId + '/status/comments?readStatus=' + false)
            .then(response => response.json() as Promise<IMessageDto[]>)
            .then(data => this.setState({
                messageDtos: data, messagesUpdated: true, unReadMessage: data.length
            })).catch(error => console.log(error));

        fetch('api/tracker/' + this.props.logins[0].clientId + '/status/comments/meals?readStatus=' + false)
            .then(response => response.json() as Promise<IMessageDto[]>)
            .then(data => this.setState({
                messageMealsDtos: data, mealMessagesUpdated: true, unReadMessageMeals: data.length
            })).catch(error => console.log(error));

        var date = new Date();
        date.setHours(0, 0, 0, 0);
        fetch('api/tracker/' + this.props.logins[0].clientId + '/status/comments/measurements?dateString=' + date.toISOString() + '&readStatus=' + false)
            .then(response => response.json() as Promise<IMessageDto[]>)
            .then(data => this.setState({
                messageMeasurementsDtos: data, measurementMessagesUpdated: true, unReadMessageMeasurements: data.length
            })).catch(error => console.log(error));
    }

    public componentDidMount() {
        fetch('api/Utilities/app/version')
            .then(response => response.json() as Promise<IVersion>)
            .then(data => this.setState({
                versionDto: data, apiVersionUpdate: true
            })).catch(error => console.log(error));

        this.props.getLogin();
    }

    public displayUpdate = () => {
        if (requireVersionUpdate(this.state.version)) {
            return (<div style={DivRequireUpdateLabelStyle}>
                <a>{UpdateVersionText}</a>
            </div>)
        }
    }

    onSubmit = () => {
        this.setState({ username: '', password:'' });
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
            username: '', password: '', activeItem: '', error: '', login: '',
            messageDtos: [], messagesUpdated: false, checkMail: false, unReadMessage: 0, unReadMessageMeals: 0,
            clientDtos: [], clientList: [], clientUpdated: false, toClientId: 2, checkClients: false,
            loginDtos: [], messageMealsDtos: [], mealMessagesUpdated: false, messageMeasurementsDtos: [],
            measurementMessagesUpdated: false, unReadMessageMeasurements: 0,
            version: { major: 0, minor: 0, build: 0 },
            versionDto: { major: 0, minor: 0, build: 0 },
            apiVersionUpdate: false, openResetPwd: false, fetchAllData: false
        };
    }

    handleItemClick = (e: any, { name }: any) => this.setState({ activeItem: name })

    getAdmin = () => {
        if (this.props.logins[0].username === 'admin') {
            return (
                <Menu.Item
                    name='Master'
                    onClick={this.handleItemClick}>
                    <Icon color='olive' name='power' />
                    Master View
                    </Menu.Item>);
        }
    }

    getMealsReview = () => {
        if (this.props.logins[0].username === 'admin') {
            return (
                <Menu.Item
                    name='Meals Logger (Admin)'
                    onClick={this.handleItemClick}>
                    <Icon name='clipboard outline'/>
                    <div>Meals</div><div>Logs</div>
                    <Label color='red' floating>
                        {this.state.unReadMessageMeals}
                    </Label>
                    </Menu.Item>);
        }

        return (
            <Menu.Item
                name='Meals Logger'
                onClick={this.handleItemClick}>
                <Icon name='clipboard outline'/>
                <div>Meals</div><div>Logs</div>
                <Label color='red' floating>
                    {this.state.unReadMessageMeals}
                </Label>
                </Menu.Item>
        );
    }

    getMeasurementsReview = () => {
        if (this.props.logins[0].username === 'admin') {
            return (
                <Menu.Item
                    name='Measurements Logger Admin'
                    onClick={this.handleItemClick}>
                    <Icon name='clipboard outline'/>
                    <div>Measurements</div><div>Logs</div>
                    <Label color='red' floating>
                        {this.state.unReadMessageMeasurements}
                    </Label>
                    </Menu.Item>);
        }

        return (
            <Menu.Item
                name='Measurements Logger'
                onClick={this.handleItemClick}>
                <Icon name='clipboard outline'/>
                <div>Measurements</div><div>Logs</div>
                <Label color='red' floating>
                    {this.state.unReadMessageMeasurements}
                </Label>
                </Menu.Item>
        );
    }

    getMealsReviewByDate = () => {
        if (this.props.logins[0].username === 'admin') {
            return (
                <Menu fluid vertical icon='labeled' color='teal' inverted>
                    <Menu.Item
                        name='Meals Logger by Date (Admin)'
                        onClick={this.handleItemClick}>
                        <Icon name='clipboard outline'/>
                        Logged Meals by Date
                        <Label color='red' floating>
                            {this.state.unReadMessageMeals}
                        </Label>
                    </Menu.Item>
                </Menu>);
        }
    }

    setToClient = (event: any, data: any) => {
        this.setState({ toClientId: data['value'] });

        // get logins
        fetch('api/login/' + data['value'])
            .then(response => response.json() as Promise<LoginDto[]>)
            .then(data => this.setState({ loginDtos: data, username: data[0].username, password: data[0].password })).catch(error => console.log(error));
    }

    handleOpen = (open: boolean) => {
        this.setState({ openResetPwd: open });
    }

    getUserInfo = () => {
        if (this.state.clientDtos.length > 0) {
            var name = this.state.clientDtos[0].firstName;
            var lastSeen = new Date(this.props.logins[0].lastLogin);
            return name + ', last login: ' + lastSeen.toLocaleDateString();
        }
    }

    getPhoto = () => {
        if (this.state.clientDtos.length > 0) {
            var img = this.state.clientDtos[0].avatar;
            if (img != '') {
                return '/images/avatars/' + img;
            }
            else {
                return 'https://react.semantic-ui.com/images/avatar/small/rachel.png';
            }
        }
    }

    getInfoRow = () => {
        if (this.state.clientDtos.length > 0) {
            return (<Grid.Row>
                <Grid.Column textAlign='right'>
                    <Image avatar src={this.getPhoto()} />
                    <a>{this.getUserInfo()}</a>
                </Grid.Column>
            </Grid.Row>);
        }
    }

    render() {
        var divStyle2 = {
            fontStyle: 'italic',
            fontFamily: 'Comic Sans MS',
            fontSize: '13px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        };

        var divLabelStyle2 = {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        };

        var divLoaderStyle = {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        };

        if (this.state.apiVersionUpdate === true) {
            this.setState({ version: this.state.versionDto, apiVersionUpdate: false });
        }
        else if ((this.state.apiVersionUpdate == false && this.state.version.major == 0)) {
            return (<div style={divLoaderStyle}>
                <Dimmer active inverted>
                    <Loader content='Loading' />
                </Dimmer>
            </div>);
        }

        if (this.state.login==='logging' && !this.props.isLoading && this.props.logins.length < 1) {
            if (this.state.error !== 'Please Check Username or Password') {
                this.setState({ error: 'Please Check Username or Password' });
            }
        }

        if (this.props.logins.length > 0 && this.props.logins[0].username !== 'admin2') {
            if (!this.state.fetchAllData) {
                this.fetchAllData();
                this.setState({ fetchAllData: true });
            }
            if (!this.state.messagesUpdated ||
                !this.state.mealMessagesUpdated ||
                !this.state.measurementMessagesUpdated ||
                !this.state.clientUpdated) {
                return (<div style={divLoaderStyle}>
                    <Dimmer active inverted>
                        <Loader content='Loading' />
                    </Dimmer>
                </div>);
            }
            else {
                if (this.state.error !== 'Login is Successfull') {
                    this.setState({ error: 'Login is Successfull' });
                }

                if (this.state.activeItem === 'Master') {
                    return (<Redirect to="/master" />);
                }

                if (this.state.activeItem === 'Macro') {
                    return (<Redirect to="/personal" />);
                }

                if (this.state.activeItem === 'Body') {
                    return (<Redirect to="/measurements" />);
                }

                if (this.state.activeItem === 'Meal') {
                    return (<Redirect to="/meals" />);
                }

                if (this.state.activeItem === 'New Meal') {
                    return (<Redirect to="/macroguide" />);
                }

                if (this.state.activeItem === 'Activity') {
                    return (<Redirect to="/activities" />);
                }

                if (this.state.activeItem === 'Dashboard') {
                    return (<Redirect to="/dashboard" />);
                }

                if (this.state.activeItem === 'EBook') {
                    return (<Redirect to="/ebook" />);
                }

                if (this.state.activeItem === 'Admin') {
                    return (<Redirect to="/admin" />);
                }

                if (this.state.activeItem === 'Messages') {
                    return (<Redirect to="/messages" />);
                }

                if (this.state.activeItem === 'Meals Logger') {
                    return (<Redirect to="/messagesmeals" />);
                }

                if (this.state.activeItem === 'Meals Logger (Admin)') {
                    return (<Redirect to="/messagesmealsadmin" />);
                }

                if (this.state.activeItem === 'Meals Logger by Date (Admin)') {
                    return (<Redirect to="/messagesmealsadminbydate" />);
                }

                if (this.state.activeItem === 'Measurements Logger') {
                    return (<Redirect to="/messagesmeasurements" />);
                }

                if (this.state.activeItem === 'Measurements Logger Admin') {
                    return (<Redirect to="/messagesmeasurementsadminbydate" />);
                }

                if (this.state.activeItem === 'Nutrients Lookup') {
                    return (<Redirect to="/macroguidesearch" />);
                }

                return (
                    <div>
                        {this.displayUpdate()}
                        <Grid centered>
                            {this.getInfoRow()}
                            <Grid.Row columns={3}>
                                <Grid.Column>
                                    <Menu fluid vertical icon='labeled' color='olive' inverted>
                                        <Menu.Item
                                            name='Macro'
                                            onClick={this.handleItemClick}>
                                            <Icon name='balance scale' />
                                            <div>Macro</div><div>Calculation</div>
                                        </Menu.Item>
                                    </Menu>
                                    <Menu fluid vertical icon='labeled' color='green' inverted>
                                        <Menu.Item
                                            name='Nutrients Lookup'
                                            onClick={this.handleItemClick}>
                                            <Icon name='search' />
                                            <div>Nutrients</div><div>Lookup</div>
                                        </Menu.Item>
                                    </Menu>
                                    <Menu fluid vertical icon='labeled' color='red' inverted>
                                        <Menu.Item
                                            name='Admin'
                                            onClick={this.handleItemClick}>
                                            <Icon name='user outline' />
                                            <div>Admin</div><div>Features</div>
                                        </Menu.Item>
                                    </Menu>
                                    <Menu fluid vertical icon='labeled' color='black' inverted>
                                        <Menu.Item
                                            name='Logout'
                                            onClick={this.clearCredentials}>
                                            <Icon name='power off' />
                                            <div>Logout</div><div>App</div>
                                        </Menu.Item>
                                    </Menu>
                                </Grid.Column>
                                <Grid.Column>
                                    <Menu fluid vertical icon='labeled' color='red' inverted>
                                        <Menu.Item
                                            name='New Meal'
                                            onClick={this.handleItemClick}>
                                            <Icon name='food' />
                                            <div>
                                                Meals
                                        </div>
                                            <div>
                                                Tracker
                                        </div>
                                        </Menu.Item>
                                    </Menu>
                                    <Menu fluid vertical icon='labeled' color='blue' inverted>
                                        <Menu.Item
                                            name='Body'
                                            onClick={this.handleItemClick}>
                                            <Icon name='calculator' />
                                            <div>Measurement</div><div>Tracker</div>
                                        </Menu.Item>
                                    </Menu>
                                    <Menu fluid vertical icon='labeled' color='orange' inverted>
                                        <Menu.Item
                                            name='Activity'
                                            onClick={this.handleItemClick}>
                                            <Icon name='child' />
                                            <div>Activities</div><div>Tracker</div>
                                        </Menu.Item>
                                    </Menu>
                                    <Menu fluid vertical icon='labeled' color='pink' inverted>
                                        <Menu.Item
                                            name='Dashboard'
                                            onClick={this.handleItemClick}>
                                            <Icon name='chart bar' />
                                            <div>Dashboards</div><div>Leaderboards</div>
                                        </Menu.Item>
                                    </Menu>
                                </Grid.Column>
                                <Grid.Column>
                                    <Menu fluid vertical icon='labeled' color='green' inverted>
                                        {this.getMealsReview()}
                                    </Menu>
                                    {this.getMealsReviewByDate()}
                                    <Menu fluid vertical icon='labeled' color='teal' inverted>
                                        {this.getMeasurementsReview()}
                                    </Menu>
                                    <Menu fluid vertical icon='labeled' color='blue' inverted>
                                        <Menu.Item
                                            name='Messages'
                                            onClick={this.handleItemClick}>
                                            <Icon name='mail' />
                                            <div>Messages</div><div>Inbox</div>
                                            <Label color='red' floating>
                                                {this.state.unReadMessage}
                                            </Label>
                                        </Menu.Item>
                                    </Menu>
                                    <Menu fluid vertical icon='labeled' color='purple' inverted>
                                        <Menu.Item
                                            name='EBook'
                                            onClick={this.handleItemClick}>
                                            <Icon name='book' />
                                            <div>E-Books</div><div>Access</div>
                                        </Menu.Item>
                                    </Menu>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </div>)
            };
        }
        else if (this.props.logins.length > 0 && this.props.logins[0].username === 'admin2') {

            return (
                <div>
                    <div style={divLabelStyle2}>
                        <h1>My Health & Fitness Tracker</h1>
                    </div>
                    <a>Select Client:</a><Dropdown id='toClient' value={this.state.toClientId} search selection options={this.state.clientList} onChange={this.setToClient} />
                    <Form size="small">
                        <div>
                            <Button type='submit' primary onClick={this.getLoginCredentials}>Login</Button>
                            <a>{this.state.error}</a>
                        </div>
                    </Form>
                </div>
            );
        }

        return (
            <div>
                <Segment attached='top'>
                    <div style={divLabelStyle2}>
                        <Grid>
                            <Grid.Column>
                                <div id='logo'><Image src="fit2fitter_small_logo_2.jpg" size='small' /></div>
                                <div id='text' style={divStyle2}>
                                    <a>by Ida</a>
                                </div>
                            </Grid.Column>
                        </Grid>
                    </div>
                    <div style={divLabelStyle2}>
                        <Grid centered>
                            <Grid.Row textAlign='center'></Grid.Row>
                            <Grid.Row textAlign='center'>
                                <Grid.Column textAlign='center' width={2}/>
                                <Grid.Column textAlign='center' width={12}>
                                    <h3 className="text-signin">Please sign in</h3>
                                </Grid.Column>
                                <Grid.Column textAlign='center' width={2} />
                                <Grid.Column textAlign='center' width={2} />
                                <Grid.Column textAlign='center' width={12}>
                                    <Form size="small">
                                        <Form.Field>
                                            <Input type="username" value={this.state.username} placeholder='Username' onChange={this.updateInput} />
                                            <Input type="password" value={this.state.password} placeholder='Password' onChange={this.updateInput2} />
                                        </Form.Field>
                                        <div>
                                            <Button type='submit' primary onClick={this.getLoginCredentials}>Login</Button>
                                            <Modal
                                                open={this.state.openResetPwd}
                                                onClose={() => this.handleOpen(false)}
                                                onOpen={() => this.handleOpen(true)}
                                                trigger={<Button color='red' type='submit'>Reset</Button>}>
                                                <Modal.Header> <div style={divLabelStyle2}>
                                                    <h1>Reset Password</h1>
                                                </div></Modal.Header>
                                                <Modal.Content scrolling>
                                                    <Modal.Description>
                                                        <AdminResetPwd username={this.state.username} />
                                                    </Modal.Description>
                                                </Modal.Content>
                                                <Modal.Actions>
                                                    <Button onClick={() => this.handleOpen(false)} primary>
                                                        Close <Icon name='chevron right' />
                                                    </Button>
                                                </Modal.Actions>
                                            </Modal>
                                        </div>
                                    </Form>
                                </Grid.Column>
                                <Grid.Column textAlign='center' width={2}/>
                            </Grid.Row>
                        </Grid>
                    </div>
                    <div style={divWarningLabelStyle}><a>{this.state.error}</a></div>
                </Segment>
                {this.displayUpdate()}
                <Grid centered>
                    <Grid.Row />
                    <Grid.Row>
                        <Grid.Column>
                            <div style={divLabelStyle}>Food compositions standards are provided by:</div>
                            <Segment attached='bottom'>
                                <Grid centered>
                                    <Grid.Row columns={2}>
                                        <Grid.Column>
                                            <Image size='small' src='FSANZLogo.jpg' href='https://www.foodstandards.gov.au/' target='_blank' /><div>Food Standards Australia New Zealand</div>
                                        </Grid.Column>
                                        <Grid.Column>
                                            <Image size='tiny' src='USDALogo.jfif' href='https://www.usda.gov/topics/food-and-nutrition' target='_blank' /><div>United States Department of Agriculture</div>
                                        </Grid.Column>
                                    </Grid.Row>
                                </Grid>
                            </Segment>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
                <footer style={divFooterStyle}> <small>&copy; Copyright 2021, Fit2Fitter by Ida v.{CurrentVersion.major}.{CurrentVersion.minor}.{CurrentVersion.build}</small> </footer>
            </div>
            );
    }

    private getLoginCredentials = () => {
        if (this.state.username === '' || this.state.password === '') {
            this.setState({ error: 'Please Dont Leave Empty Fields' });
            return;
        }
        this.setState({
            error: 'loading..', login: 'logging', checkMail: false,
            clientUpdated: false, messagesUpdated: false,
            mealMessagesUpdated: false, measurementMessagesUpdated: false
        });
        this.props.requestLogout(this.state.username, this.state.password);
        this.props.requestLogins(this.state.username, this.state.password);
    }

    private clearCredentials = () => {
        this.props.requestLogout(this.state.username, this.state.password);
        this.setState({
            login: 'logout',
            error: 'Logout is Successfull', checkMail: false,
            clientUpdated: false, messagesUpdated: false,
            mealMessagesUpdated: false, measurementMessagesUpdated: false, fetchAllData: false
        });
    }
}

//export default connect()(Home);
export default connect(
    (state: ApplicationState) => state.logins, // Selects which state properties are merged into the component's props
    LoginStore.actionCreators // Selects which action creators are merged into the component's props
)(Home as any);
