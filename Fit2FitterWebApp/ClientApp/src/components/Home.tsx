import * as React from 'react';
import { connect } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';
import { Button, Form, Input, Grid, Icon, Menu } from 'semantic-ui-react'
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
}

// At runtime, Redux will merge together...
type LoginProps =
    IProps
    & LoginStore.LoginState // ... state we've requested from the Redux store
    & typeof LoginStore.actionCreators // ... plus action creators we've requested
    & RouteComponentProps<{ username: string, password: string }>; // ... plus incoming routing parameters
    
class Home extends React.Component<LoginProps, IState > {
    
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
            username: '', password: '', activeItem: '', error: '', login:''
        };
    }

    handleItemClick = (e: any, { name }: any) => this.setState({ activeItem: name })

    getAdmin = () => {
        if (this.props.logins[0].username === 'admin') {
            return (
                <Menu fluid vertical icon='labeled'>
                    <Menu.Item
                        name='Master'
                        onClick={this.handleItemClick}>
                        <Icon color='olive' name='power' />
                        Master View
                    </Menu.Item>
                </Menu>);
        }
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

        if (this.props.logins.length > 0) {
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
        //if (true) {
            return (
                <div>
                    <Grid centered>
                        <Grid.Row columns={2}>
                            <Grid.Column width={8}>
                                <Menu fluid vertical icon='labeled'>
                                    {this.getAdmin()}
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
                                            name='Meal'
                                            onClick={this.handleItemClick}>
                                            <Icon color='green' name='food' />
                                            Meals Tracker
                                    </Menu.Item>
                                    <Menu.Item
                                            name='Activity'
                                            onClick={this.handleItemClick}>
                                            <Icon color='orange' name='child' />
                                            Activities Tracker
                                    </Menu.Item>
                                </Menu>
                            </Grid.Column>
                            <Grid.Column width={8}>
                                <Menu fluid vertical icon='labeled'>
                                    <Menu.Item
                                        name='Dashboard'
                                        onClick={this.handleItemClick}>
                                        <Icon color='pink' name='chart bar' />
                                        Leaderboards
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
                                    <Menu.Item
                                            name='Logout'
                                            onClick={this.clearCredentials}>
                                            <Icon color='black' name='power off' />
                                            Logout
                                    </Menu.Item>
                                </Menu>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </div>);
        }

        return (
            <div>
                <div style={divLabelStyle2}>
                    <h1>My Fitness Tracker</h1>
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
