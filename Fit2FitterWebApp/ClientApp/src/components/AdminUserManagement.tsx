import * as React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';
import { Grid, Dimmer, Label, Loader, Image, Icon, Flag, Dropdown, Input, Button, Modal } from 'semantic-ui-react'
import { ApplicationState } from '../store';
import * as LoginStore from '../store/Login';
import 'react-semantic-ui-datepickers/dist/react-semantic-ui-datepickers.css';
import AppsMenu from './AppMenus';
import { isNullOrUndefined } from 'util'
import AdminUserRegistration from './AdminUserRegistration';
import AdminUserRegistrationModify from './AdminUserRegistrationModify';

interface IProps {
}

interface IState {
    keyword: string;
    selectedDate: Date;
    prevDate: Date;
    updated: boolean;
    apiUpdate: boolean;
    clientDownloaded: boolean;
    dateChanged: boolean;
    clients: IClient[];
    clientDtos: IClientDto[];
    group: string;
    fromDate: Date;
    clientList: IOption[];
    toClientId: number;
    openAddUser: boolean;
    openUpdateUser: boolean;
    currentClientId: number;
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

// At runtime, Redux will merge together...
type LoginProps =
    IProps
    & LoginStore.LoginState // ... state we've requested from the Redux store
    & typeof LoginStore.actionCreators // ... plus action creators we've requested
    & RouteComponentProps<{ username: string, password: string }>; // ... plus incoming routing parameters

class AdminUserManagement extends React.Component<LoginProps, IState> {
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
        }
    }

    updateInput = (event: any) => {
        this.setState({ keyword: event.target.value });
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
            keyword: '',
            selectedDate: new Date(),
            prevDate: new Date(),
            updated: false,
            apiUpdate: false,
            clientDownloaded: false,
            dateChanged: false,
            clientDtos: [],
            clients: [],
            group: '',
            fromDate: new Date(),
            clientList: [],
            toClientId: 3,
            openAddUser: false,
            openUpdateUser: false,
            currentClientId: 0
        };
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

    handleDateChange = (start: any, end: any) => {
        this.setState({ dateChanged: true, fromDate: start, selectedDate: end });
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

    isLoadingData = () => {
        return this.state.clientDownloaded == false; 
    }

    setToClient = (event: any, data: any) => {
        this.setState({ toClientId: data['value'], dateChanged: true });
    }

    getAllClientsOptions = () => {
        if (this.props.logins[0].username === 'admin') {
            return (<div>
                <div>Select Client:</div><Dropdown id='toClient' value={this.state.toClientId} search selection options={this.state.clientList} onChange={this.setToClient} />
            </div>);
        }
    }

    getPhotoIndicator = (photo: string, index: number) => {
        if (isNullOrUndefined(photo) || photo === '') {
            return (<div />);
        }
        return (<Label size='tiny' key={index + 100} as='a' corner='right'>
            <Icon key={index + 100} color='blue' size='tiny' name='camera' />
        </Label>);
    }

    onClick = (event: any, key : any) => {
        console.log(key);
        console.log(event);
    }

    getRows = () => {
        var keyword = this.state.keyword.toLowerCase()
        var arr = this.state.clientDtos.filter(x => x.firstName.toLowerCase().search(keyword) !== -1);
        return (
            arr.map((item, index) =>
                <Grid.Row textAlign="center" className={'row'} key={"client" + index.toString()} columns={5} stretched>
                    {this.getPhotoIndicator(item.avatar, index)}
                    <Grid.Column className={'col_edit'} key={index} width={2} verticalAlign='middle' textAlign='center'>
                        <Modal
                            className={index.toString()}
                            key={index}
                            open={this.state.openUpdateUser && this.state.currentClientId === item.id}
                            onClose={() => this.handleOpenModifyUser(false, item.id)}
                            onOpen={() => this.handleOpenModifyUser(true, item.id)}
                            trigger={<Button className={index.toString()} key={item.id.toString()} basic size='tiny' onClick={this.onClick} icon="edit" fluid />}>
                            <Modal.Header>Update User</Modal.Header>
                            <Modal.Content scrolling>
                                <Modal.Description>
                                    <AdminUserRegistrationModify clientId={this.state.currentClientId} />
                                </Modal.Description>
                            </Modal.Content>
                            <Modal.Actions>
                                <Button size='tiny' onClick={() => this.handleCancelUpdate(false)} secondary>
                                    Done <Icon name='chevron right' />
                                </Button>
                            </Modal.Actions>
                        </Modal>
                    </Grid.Column>
                    <Grid.Column className={'col_name'} key={index + 1} width={6}>
                        <div className="text-table-row" key={index + 1}>{item.firstName}</div>
                    </Grid.Column>
                    <Grid.Column className={'col_city'} key={index + 2} width={2}>
                        <div className="text-table-row" key={index + 2}>{item.city}</div>
                    </Grid.Column>
                    <Grid.Column className={'col_age'} key={index + 3} width={2}>
                        <a className="text-table-row" key={index + 3}>{item.age}</a>
                    </Grid.Column>
                    <Grid.Column className={'col_grp'} key={index + 4} width={4}>
                        <div className="text-table-row" key={index + 4}>{item.grp}</div>
                    </Grid.Column>
                </Grid.Row>
            ));
    }

    handleOpen = (open: boolean) => {
        this.setState({ openAddUser: open });
    }

    handleOpenModifyUser = (open: boolean, clientId: number) => {
        this.setState({ openUpdateUser: open, currentClientId: clientId });
    }

    handleAdd = (open: boolean) => {
        this.setState({ updated: true, openAddUser: open });
    }

    handleCancelAdd = (open: boolean) => {
        if (open === false) {
            this.setState({ openAddUser: open, clientDownloaded: false });
            //get client info
            fetch('api/client/all')
                .then(response => response.json() as Promise<IClientDto[]>)
                .then(data => this.setState({
                    clientDtos: data, apiUpdate: true
                })).catch(error => console.log(error));
        }
        else {
            this.setState({ openAddUser: open });
        }
    }

    handleCancelUpdate = (open: boolean) => {
        this.setState({ openUpdateUser: open });
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
                            <AppsMenu activeParentItem='User' activeItem='User Management' logins={this.props.logins} clientDtos={this.state.clientDtos} />
                        </Grid.Column>
                        <Grid.Column width={3} floated='left'>
                            <Modal
                                open={this.state.openAddUser}
                                onClose={() => this.handleOpen(false)}
                                onOpen={() => this.handleOpen(true)}
                                trigger={<Button basic size='tiny' fluid>
                                    New User
                                </Button>}>
                                <Modal.Header>Add New User</Modal.Header>
                                <Modal.Content scrolling>
                                    <Modal.Description>
                                        <AdminUserRegistration/>
                                    </Modal.Description>
                                </Modal.Content>
                                <Modal.Actions>
                                    <Button size='tiny' onClick={() => this.handleCancelAdd(false)} secondary>
                                        Done <Icon name='chevron right' />
                                    </Button>
                                </Modal.Actions>
                            </Modal>
                        </Grid.Column>
                        <Grid.Column width={16} stretched>
                            <Input type="username" value={this.state.keyword} placeholder='name' onChange={this.updateInput} />
                        </Grid.Column>
                        <Grid.Column width={16}>
                            <Grid centered>
                                <Grid.Row columns={4} textAlign='center'>
                                    <Grid.Column width={2} textAlign='left'>
                                        <div className="text-table-row">Edit</div>
                                    </Grid.Column>
                                    <Grid.Column width={6} textAlign='left'>
                                        <div className="text-table-row">Name</div>
                                    </Grid.Column>
                                    <Grid.Column width={2} textAlign='left'>
                                        <div className="text-app-menu">City</div>
                                    </Grid.Column>
                                    <Grid.Column width={2} textAlign='left'>
                                        <div className="text-app-menu">Age</div>
                                    </Grid.Column>
                                    <Grid.Column width={4} textAlign='left'>
                                        <div className="text-app-menu">Group</div>
                                    </Grid.Column>
                                </Grid.Row>
                                {this.getRows()}
                            </Grid>
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
)(AdminUserManagement as any);