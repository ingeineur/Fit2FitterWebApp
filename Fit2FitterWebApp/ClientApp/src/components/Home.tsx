import * as React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';
import { Button, Form, Input, Grid, Icon, Menu, Dropdown, Modal, Image, Loader, Dimmer, Segment } from 'semantic-ui-react'
import { ApplicationState } from '../store';
import * as LoginStore from '../store/Login';
import { IVersion, UpdateVersionText, DivRequireUpdateLabelStyle, CurrentVersion } from '../models/version';
import { IClientDto, LoginDto } from '../models/clients';
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

interface IOption {
    key: string,
    text: string,
    value: string
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

var divAskLabelStyle = {
    color: 'blue'
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
            checkMail: false,
            clientDtos: [], clientList: [], clientUpdated: false, toClientId: 2, checkClients: false,
            loginDtos: [],
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
            if (!this.state.clientUpdated) {
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

                return (<Redirect to="/dashboarddaily" />);
            };
        }
        else if (this.props.logins.length > 0 && this.props.logins[0].username === 'admin2') {
            if (!this.state.fetchAllData) {
                this.fetchAllData();
                this.setState({ fetchAllData: true });
            }

            if (!this.state.clientUpdated) {
                return (<div style={divLoaderStyle}>
                    <Dimmer active inverted>
                        <Loader content='Loading' />
                    </Dimmer>
                </div>);
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
                <Segment attached='top'>
                    <div style={divLabelStyle2}>
                        <Grid>
                            <Grid.Column>
                                <div id='logo'><Image src="fit2fitter_new_logo_1.png" size='medium' /></div>
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
                                            <Button basic circular fluid type='submit' color='pink' onClick={this.getLoginCredentials}>Log in</Button>
                                        </div>
                                        <div>
                                            <Modal
                                                open={this.state.openResetPwd}
                                                onClose={() => this.handleOpen(false)}
                                                onOpen={() => this.handleOpen(true)}
                                                trigger={<Button inverted as='a' style={divAskLabelStyle}>Forgot your password?</Button>}>
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
                                        <a href="mailto:techsupport@idafit2fitter.com?subject=SupportIssues">Email Technical Support</a>
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
            clientUpdated: false,
            fetchAllData: false
        });
        this.props.requestLogout(this.state.username, this.state.password);
        this.props.requestLogins(this.state.username, this.state.password);
    }
}

//export default connect()(Home);
export default connect(
    (state: ApplicationState) => state.logins, // Selects which state properties are merged into the component's props
    LoginStore.actionCreators // Selects which action creators are merged into the component's props
)(Home as any);
