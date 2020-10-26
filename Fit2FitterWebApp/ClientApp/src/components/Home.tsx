import * as React from 'react';
import { connect } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';
import { Button, Form, Input, Grid, Icon, Menu, Dropdown } from 'semantic-ui-react'
import { ApplicationState } from '../store';
import * as LoginStore from '../store/Login';

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
    messageDtos: IMessageDto[];
    messageMealsDtos: IMessageDto[];
    apiUpdate: boolean;
    clientDtos: IClientDto[];
    clientList: IOption[],
    clients: IClient[];
    toClientId: number;
    checkClients: boolean;
    loginDtos: LoginDto[] 
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

    public componentDidMount() {
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
            loginDtos: [], messageMealsDtos: []
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
                    name='Logged Meals (Admin)'
                    onClick={this.handleItemClick}>
                    <Icon color='violet' name='clipboard outline' />
                    Logged Meals ({this.state.unReadMessageMeals})
                    </Menu.Item>);
        }

        return (
            <Menu.Item
                name='Logged Meals'
                onClick={this.handleItemClick}>
                <Icon color='violet' name='clipboard outline' />
                Logged Meals ({this.state.unReadMessageMeals})
                </Menu.Item>
        );
    }

    setToClient = (event: any, data: any) => {
        this.setState({ toClientId: data['value'] });

        // get logins
        fetch('api/login/' + data['value'])
            .then(response => response.json() as Promise<LoginDto[]>)
            .then(data => this.setState({ loginDtos: data, username: data[0].username, password: data[0].password })).catch(error => console.log(error));
    }

    render() {
        var divStyle = {
            fontSize: '15px'
        };
        var divLabelStyle2 = {
            color: 'pink',
            fontStyle: 'italic'
        };
        
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
                }
            }

            if (this.state.apiUpdate === true) {
                var miscMsg = this.state.messageDtos.filter(x => x.mealsRef === '0');
                this.setState({ unReadMessage: miscMsg.length, apiUpdate: false });

                var unreadMsg = this.state.messageMealsDtos.filter(x => x.readStatus === false && x.clientId === this.props.logins[0].clientId);
                this.setState({ unReadMessageMeals: unreadMsg.length });

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

            if (this.state.activeItem === 'Logged Meals') {
                return (<Redirect to="/messagesmeals" />);
            }

            if (this.state.activeItem === 'Logged Meals (Admin)') {
                return (<Redirect to="/messagesmealsadmin" />);
            }
            //if (true) {
            return (
                <div>
                    <Grid centered>
                        <Grid.Row columns={2}>
                            <Grid.Column width={8}>
                                <Menu fluid vertical icon='labeled'>
                                    <Menu.Item
                                        name='Messages'
                                        onClick={this.handleItemClick}>
                                        <Icon color='blue' name='mail' />
                                        Messages ({this.state.unReadMessage})
                                    </Menu.Item>
                                    <Menu.Item
                                        name='New Meal'
                                        onClick={this.handleItemClick}>
                                        <Icon color='red' name='food' />
                                        Meals Tracker
                                    </Menu.Item>
                                    <Menu.Item
                                        name='Activity'
                                        onClick={this.handleItemClick}>
                                        <Icon color='orange' name='child' />
                                        Activities Tracker
                                    </Menu.Item>
                                    <Menu.Item
                                        name='Dashboard'
                                        onClick={this.handleItemClick}>
                                        <Icon color='pink' name='chart bar' />
                                        Leaderboards
                                    </Menu.Item>
                                </Menu>
                            </Grid.Column>
                            <Grid.Column width={8}>
                                <Menu fluid vertical icon='labeled'>
                                    <Menu.Item
                                        name='Macro'
                                        onClick={this.handleItemClick}>
                                        <Icon color='olive' name='balance scale' />
                                        Macro Calculation
                                    </Menu.Item>
                                    <Menu.Item
                                        name='Body'
                                        onClick={this.handleItemClick}>
                                        <Icon color='blue' name='calculator' />
                                        Body Assessments
                                    </Menu.Item>
                                    <Menu.Item
                                        name='EBook'
                                        onClick={this.handleItemClick}>
                                        <Icon color='purple' name='book' />
                                        E-Books
                                    </Menu.Item>
                                    <Menu.Item
                                        name='Admin'
                                        onClick={this.handleItemClick}>
                                        <Icon color='red' name='user' />
                                        Admin
                                    </Menu.Item>
                                </Menu>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column width={8}>
                                <Menu fluid vertical icon='labeled'>
                                    <Menu.Item
                                        name='Logout'
                                        onClick={this.clearCredentials}>
                                        <Icon color='black' name='power off' />
                                        Logout
                                    </Menu.Item>
                                </Menu>
                            </Grid.Column>
                            <Grid.Column width={8}>
                                <Menu fluid vertical icon='labeled'>
                                    {this.getMealsReview()}
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
                        <a>{this.state.error}</a>
                    </div>
                </Form>
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
