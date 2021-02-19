import * as React from 'react';
import { connect } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';
import { Button, Form, Input, Grid, Icon, Menu, Dropdown, Modal, Label } from 'semantic-ui-react'
import { ApplicationState } from '../store';
import * as LoginStore from '../store/Login';
import { IVersion, UpdateVersionText, DivRequireUpdateLabelStyle, CurrentVersion } from '../models/version';
import { requireVersionUpdate } from '../services/utilities'
import AdminResetPwd from './AdminResetPwd'

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
    messageMealsDtos: IMessageDto[];
    messageMeasurementsDtos: IMessageDto[];
    apiUpdate: boolean;
    clientDtos: IClientDto[];
    clientList: IOption[],
    clients: IClient[];
    toClientId: number;
    checkClients: boolean;
    loginDtos: LoginDto[];
    versionDto: IVersion;
    version: IVersion;
    apiVersionUpdate: boolean;
    openResetPwd: boolean;
}

interface LoginDto {
    id: number,
    username: string;
    password: string;
    active: boolean;
    lastLogin: string;
    clientId: number;
}

interface IClient {
    id: number
    name: string;
    age: number;
    city: string;
}
interface IClientDto {
    id: number,
    lastName: string;
    firstName: string;
    address: string;
    city: string;
    age: number;
    created: string;
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

// At runtime, Redux will merge together...
type LoginProps =
    IProps
    & LoginStore.LoginState // ... state we've requested from the Redux store
    & typeof LoginStore.actionCreators // ... plus action creators we've requested
    & RouteComponentProps<{ username: string, password: string }>; // ... plus incoming routing parameters
    
class Home extends React.Component<LoginProps, IState > {

    getAllMeasurementsMessages = () => {
        var date = new Date();
        date.setHours(0, 0, 0, 0);

        fetch('api/tracker/' + this.props.logins[0].clientId + '/comments/measurements?dateString=' + date.toISOString())
            .then(response => response.json() as Promise<IMessageDto[]>)
            .then(data => this.setState({
                messageMeasurementsDtos: data, apiUpdate: true
            })).catch(error => console.log(error));
    }

    public componentDidMount() {
        fetch('api/Utilities/app/version')
            .then(response => response.json() as Promise<IVersion>)
            .then(data => this.setState({
                versionDto: data, apiVersionUpdate: true
            })).catch(error => console.log(error));

        this.props.getLogin();

        if (this.props.logins.length > 0) {
            //get client info
            fetch('api/client/all')
                .then(response => response.json() as Promise<IClientDto[]>)
                .then(data => this.setState({
                    clientDtos: data, apiUpdate: true
                })).catch(error => console.log(error));

            fetch('api/tracker/' + this.props.logins[0].clientId + '/status/comments?readStatus=' + false)
                .then(response => response.json() as Promise<IMessageDto[]>)
                .then(data => this.setState({
                    messageDtos: data, apiUpdate: true
                })).catch(error => console.log(error));

            fetch('api/tracker/' + this.props.logins[0].clientId + '/all/comments/meals')
                .then(response => response.json() as Promise<IMessageDto[]>)
                .then(data => this.setState({
                    messageMealsDtos: data, apiUpdate: true
                })).catch(error => console.log(error));

            this.getAllMeasurementsMessages();
        }
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
            messageDtos: [], checkMail: false, unReadMessage: 0, unReadMessageMeals:0, apiUpdate: false,
            clientDtos: [], clientList: [], clients: [], toClientId: 2, checkClients: false,
            loginDtos: [], messageMealsDtos: [], messageMeasurementsDtos: [], unReadMessageMeasurements: 0,
            version: { major: 0, minor: 0, build: 0 },
            versionDto: { major: 0, minor: 0, build: 0 },
            apiVersionUpdate: false, openResetPwd: false
        };
    }

    handleItemClick = (e: any, { name }: any) => this.setState({ activeItem: name })

    setValuesFromDto = () => {
        if (this.state.clients.length > 0) {
            return;
        }

        this.state.clientDtos.forEach(client => {
            this.state.clients.push({ id: client.id, name: client.firstName, age: client.age, city: client.city });
        });

        this.setState({ clients: this.state.clients });
    }

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
                    <Icon name='clipboard outline' color='red' />
                    Meals Logs
                    <Label color='red' floating>
                        {this.state.unReadMessageMeals}
                    </Label>
                    </Menu.Item>);
        }

        return (
            <Menu.Item
                name='Meals Logger'
                onClick={this.handleItemClick}>
                <Icon name='clipboard outline' color='red' />
                Meals Logs
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
                    <Icon name='clipboard outline' color='blue' />
                    Measurements Logs
                    <Label color='red' floating>
                        {this.state.unReadMessageMeasurements}
                    </Label>
                    </Menu.Item>);
        }

        return (
            <Menu.Item
                name='Measurements Logger'
                onClick={this.handleItemClick}>
                <Icon name='clipboard outline' color='blue'/>
                Measurements Logs
                <Label color='red' floating>
                    {this.state.unReadMessageMeasurements}
                </Label>
                </Menu.Item>
        );
    }

    getMealsReviewByDate = () => {
        if (this.props.logins[0].username === 'admin') {
            return (
                <Menu fluid vertical icon='labeled'>
                    <Menu.Item
                        name='Meals Logger by Date (Admin)'
                        onClick={this.handleItemClick}>
                        <Icon name='clipboard outline' color='red' />
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

    render() {
        var divStyle = {
            fontSize: '15px'
        };
        var divLabelStyle2 = {
            color: 'pink',
            fontStyle: 'italic'
        };

        if (this.state.apiVersionUpdate === true) {
            this.setState({ version: this.state.versionDto, apiVersionUpdate: false });
        }

        if (this.state.login==='logging' && !this.props.isLoading && this.props.logins.length < 1) {
            if (this.state.error !== 'Please Check Username or Password') {
                this.setState({ error: 'Please Check Username or Password' });
            }
        }

        if (this.props.logins.length > 0 && this.props.logins[0].username !== 'admin2') {
            if (this.state.error !== 'Login is Successfull') {
                this.setState({ error: 'Login is Successfull' });
            }

            if (this.state.checkMail === false) {
                if (this.props.logins.length > 0) {
                    fetch('api/tracker/' + this.props.logins[0].clientId + '/status/comments?readStatus=' + false)
                        .then(response => response.json() as Promise<IMessageDto[]>)
                        .then(data => this.setState({
                            messageDtos: data, checkMail: true, apiUpdate: true
                        })).catch(error => console.log(error));

                    fetch('api/tracker/' + this.props.logins[0].clientId + '/all/comments/meals')
                        .then(response => response.json() as Promise<IMessageDto[]>)
                        .then(data => this.setState({
                            messageMealsDtos: data, apiUpdate: true
                        })).catch(error => console.log(error));

                    this.getAllMeasurementsMessages();
                }
            }

            if (this.state.apiUpdate === true) {

                this.setState({ unReadMessage: this.state.messageDtos.length, apiUpdate: false });

                var unreadMsg = this.state.messageMealsDtos.filter(x => x.readStatus === false && x.clientId === this.props.logins[0].clientId);
                this.setState({ unReadMessageMeals: unreadMsg.length });

                var unreadMsg2 = this.state.messageMeasurementsDtos.filter(x => x.readStatus === false && x.clientId === this.props.logins[0].clientId);
                this.setState({ unReadMessageMeasurements: unreadMsg2.length });

                this.setValuesFromDto();
                if (this.state.clientList.length < 1) {
                    this.state.clientDtos.forEach(client => {
                        this.state.clientList.push({ key: client.id.toString(), text: client.firstName, value: client.id.toString() });
                    });
                }
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
            //if (true) {
            return (
                <div>
                    {this.displayUpdate()}
                    <Grid centered>
                        <Grid.Row columns={2}>
                            <Grid.Column width={8}>
                                <Menu fluid vertical icon='labeled'>
                                    <Menu.Item
                                        name='New Meal'
                                        onClick={this.handleItemClick}>
                                        <Icon name='food' color='red' />
                                        Meals Tracker
                                    </Menu.Item>
                                </Menu>
                                <Menu fluid vertical icon='labeled'>
                                    <Menu.Item
                                        name='Body'
                                        onClick={this.handleItemClick}>
                                        <Icon name='calculator' color='blue' />
                                        Measurement Tracker
                                    </Menu.Item>
                                </Menu>
                                <Menu fluid vertical icon='labeled' >
                                    <Menu.Item
                                        name='Activity'
                                        onClick={this.handleItemClick}>
                                        <Icon name='child' color='orange' />
                                        Activities Tracker
                                    </Menu.Item>
                                </Menu>
                                <Menu fluid vertical icon='labeled'>
                                    <Menu.Item
                                        name='Dashboard'
                                        onClick={this.handleItemClick}>
                                        <Icon name='chart bar' color='pink'  />
                                        Leaderboards
                                    </Menu.Item>
                                </Menu>
                            </Grid.Column>
                            <Grid.Column width={8}>
                                <Menu fluid vertical icon='labeled'>
                                    {this.getMealsReview()}
                                </Menu>
                                {this.getMealsReviewByDate()}
                                <Menu fluid vertical icon='labeled'>
                                    {this.getMeasurementsReview()}
                                </Menu>
                                <Menu fluid vertical icon='labeled'>
                                    <Menu.Item
                                        name='Messages'
                                        onClick={this.handleItemClick}>
                                        <Icon name='mail' color='blue' />
                                        Messages
                                        <Label color='red' floating>
                                            {this.state.unReadMessage}
                                        </Label>
                                    </Menu.Item>
                                </Menu>

                                <Menu fluid vertical icon='labeled'>
                                    <Menu.Item
                                        name='EBook'
                                        onClick={this.handleItemClick}>
                                        <Icon name='book' color='purple' />
                                        E-Books
                                    </Menu.Item>
                                </Menu>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column width={8}>
                                <Menu fluid vertical icon='labeled' color='green' inverted>
                                    <Menu.Item
                                        name='Nutrients Lookup'
                                        onClick={this.handleItemClick}>
                                        <Icon name='search' />
                                        Nutrients Lookup
                                    </Menu.Item>
                                </Menu>
                                <Menu fluid vertical icon='labeled' color='black' inverted>
                                    <Menu.Item
                                        name='Logout'
                                        onClick={this.clearCredentials}>
                                        <Icon name='power off' />
                                        Logout
                                    </Menu.Item>
                                </Menu>
                            </Grid.Column>
                            <Grid.Column width={8}>
                                <Menu fluid vertical icon='labeled' color='olive' inverted>
                                    <Menu.Item
                                        name='Macro'
                                        onClick={this.handleItemClick}>
                                        <Icon name='balance scale' />
                                        Macro Calculation
                                    </Menu.Item>
                                </Menu>
                                <Menu fluid vertical icon='labeled' color='red' inverted>
                                    <Menu.Item
                                        name='Admin'
                                        onClick={this.handleItemClick}>
                                        <Icon name='user outline' />
                                        Admin
                                    </Menu.Item>
                                </Menu>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </div>);
        }
        else if (this.props.logins.length > 0 && this.props.logins[0].username === 'admin2') {

            if (this.state.apiUpdate === true) {
                this.setState({ apiUpdate: false });
                this.setValuesFromDto();
                if (this.state.clientList.length < 1) {
                    this.state.clientDtos.forEach(client => {
                        this.state.clientList.push({ key: client.id.toString(), text: client.firstName, value: client.id.toString() });
                    });
                }
            }

            if (this.state.checkClients === false) {
                fetch('api/client/all')
                    .then(response => response.json() as Promise<IClientDto[]>)
                    .then(data => this.setState({
                        clientDtos: data, apiUpdate: true, checkClients: true
                    })).catch(error => console.log(error));
            }

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
                <div style={divLabelStyle2}>
                    <h1>My Health & Fitness Tracker</h1>
                </div>
                
                <Form size="small">
                    <Form.Field>
                        <label>Username </label>
                        <Input type="username" value={this.state.username} placeholder='Username' onChange={this.updateInput} />
                    </Form.Field>
                    <Form.Field>
                        <label>Password </label>
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
                        <a>{this.state.error}</a>
                    </div>
                </Form>
                {this.displayUpdate()}
                <footer> <small>&copy; Copyright 2021, Fit2Fitter by Ida v.{CurrentVersion.major}.{CurrentVersion.minor}.{CurrentVersion.build}</small> </footer> 
            </div>
            );
    }

    private getLoginCredentials = () => {
        if (this.state.username === '' || this.state.password === '') {
            this.setState({ error: 'Please Dont Leave Empty Fields' });
            return;
        }
        this.setState({ error: 'loading..' });
        this.setState({ login: 'logging' });
        this.props.requestLogout(this.state.username, this.state.password);
        this.props.requestLogins(this.state.username, this.state.password);
        this.setState({ checkMail: false });
    }

    private clearCredentials = () => {
        this.setState({ login: 'logout' });
        this.props.requestLogout(this.state.username, this.state.password);
        this.setState({ error: 'Logout is Successfull' });
    }
}

//export default connect()(Home);
export default connect(
    (state: ApplicationState) => state.logins, // Selects which state properties are merged into the component's props
    LoginStore.actionCreators // Selects which action creators are merged into the component's props
)(Home as any);
