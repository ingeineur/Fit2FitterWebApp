import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { Redirect } from 'react-router-dom';
import { Button, Segment, Grid, Menu, Label, Progress, Icon, Dimmer, Divider } from 'semantic-ui-react'
import { ApplicationState } from '../store';
import * as LoginStore from '../store/Login';
import 'react-semantic-ui-datepickers/dist/react-semantic-ui-datepickers.css';
import PersonalMacroTable from './PersonalMacroTable'
import PersonalHeader from './PersonalHeader'
import { IClient, IPersonal } from '../models/clients'
import { IMacroGuides, IMacrosPlan } from '../models/macros'
import AppsMenu from './AppMenus';

interface IProps {
}

interface IState {
    macroGuides: IMacroGuides;
    personal: IPersonal;
    clients: IClient[];
    macrosPlans: IMacrosPlan[];
    updated: boolean;
    apiUpdate: boolean;
    savingStatus: string;
}

// At runtime, Redux will merge together...
type LoginProps =
    IProps
    & LoginStore.LoginState // ... state we've requested from the Redux store
    & typeof LoginStore.actionCreators // ... plus action creators we've requested
    & RouteComponentProps<{ username: string, password: string }>; // ... plus incoming routing parameters

class PersonalMacro extends React.Component<LoginProps, IState> {

    public componentDidMount() {
        this.props.getLogin();
        
        if (this.props.logins.length > 0) {
            fetch('api/client?clientId=' + this.props.logins[0].clientId)
                .then(response => response.json() as Promise<IClient[]>)
                .then(data => this.setState({
                    clients: data, apiUpdate: true
                })).catch(error => console.log(error));

            fetch('api/client/' + this.props.logins[0].clientId + '/macrosplan')
                .then(response => response.json() as Promise<IMacrosPlan[]>)
                .then(data => this.setState({
                    macrosPlans: data, apiUpdate: true
                })).catch(error => console.log(error));
        }
    }

    onCancel = () => {
        this.setValuesFromDto();
    }

    getMacroType = (text: string) => {
        if (text === 'Lose Weight') {
            return 0;
        }

        if (text === 'Maintain/Muscle Gain') {
            return 1;
        }

        if (text === 'Gain Weight') {
            return 2;
        }

        return 0;
    }

    getMacroTypeText = (type: number) => {
        if (type === 0) {
            return 'Lose Weight';
        }

        if (type === 1) {
            return 'Maintain/Muscle Gain';
        }

        if (type === 2) {
            return 'Gain Weight';
        }

        return 'Lose Weight';
    }

    getActivityLevel = (text: string) => {
        if (text === 'Sedentary') {
            return 0;
        }

        if (text === 'Lightly Active') {
            return 1;
        }

        if (text === 'Moderately Active') {
            return 2;
        }

        if (text === 'Very Active') {
            return 3;
        }

        if (text === 'Extra Active') {
            return 4;
        }

        return 0;
    }

    getActivityLevelText = (type: number) => {
        if (type === 0) {
            return 'Sedentary';
        }

        if (type === 1) {
            return 'Lightly Active';
        }

        if (type === 2) {
            return 'Moderately Active';
        }

        if (type === 3) {
            return 'Very Active';
        }

        if (type === 4) {
            return 'Extra Active';
        }

        return 'Sedentary';
    }

    onSave = () => {
        if ((this.state.personal.carbPercent + this.state.personal.proteinPercent + this.state.personal.fatPercent) < 100.00) {
            this.setState({ savingStatus: 'Not Saved: Your Macro Portions is less than 100%' })
            return;
        }

        this.setState({ savingStatus: 'Saving in progress' })

        fetch('api/client', {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: this.props.logins[0].clientId,
                lastName: '',
                firstName: this.state.personal.name,
                address: this.state.clients[0].address,
                city: this.state.clients[0].city,
                age: this.state.personal.age,
                created: this.state.clients[0].created,
                avatar: this.state.personal.avatar,
            })
        }).then(response => response.json()).then(data => this.setState({ savingStatus: 'Saved' })).catch(error => console.log('put macros ---------->' + error));

       fetch('api/client/macrosplan', {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: 0,
                height: parseFloat(this.state.personal.height.toString()),
                weight: parseFloat(this.state.personal.weight.toString()),
                targetWeight: parseFloat(this.state.personal.targetWeight.toString()),
                macroType: this.getMacroTypeText(this.state.personal.macroType),
                activityLevel: this.getActivityLevelText(this.state.personal.activityLevel),
                carbPercent: this.state.personal.carbPercent,
                proteinPercent: this.state.personal.proteinPercent,
                fatPercent: this.state.personal.fatPercent,
                carbWeight: this.state.personal.carbWeight,
                proteinWeight: this.state.personal.proteinWeight,
                fatWeight: this.state.personal.fatWeight,
                manual: this.state.personal.manualMacro,
                updated: new Date(),
                created: new Date(),
                clientId: this.props.logins[0].clientId,
            })
        }).then(response => response.json()).then(data => this.setState({ savingStatus: 'Saved' })).catch(error => console.log('put macros ---------->' + error));
    }

    getComponent = () => {
        return (<PersonalMacroTable type='Macro' personal={this.state.personal} updatePersonal={this.updatePersonal} update={this.state.updated} />);
    }

    updatePersonal = (input: IPersonal) => {
        this.setState({
            personal: {
                avatar: input.avatar, name: input.name, age: input.age, height: input.height, weight: input.weight, targetWeight: input.targetWeight, activityLevel: input.activityLevel, macroType: input.macroType,
                carbPercent: input.carbPercent, proteinPercent: input.proteinPercent, fatPercent: input.fatPercent,
                carbWeight: input.carbWeight, proteinWeight: input.proteinWeight, fatWeight: input.fatWeight, manualMacro: input.manualMacro
            }
        });
        this.setState({ updated: !this.state.updated, savingStatus:'Not Saved' });
    }

    constructor(props: LoginProps) {
        super(props);
        this.updatePersonal = this.updatePersonal.bind(this);
        this.state = {
            macroGuides: { carb: 0, protein: 0, fat: 0, veg: 0, bodyFat: 0 },
            personal: {
                avatar: '', name: '', age: 0, height: 0.0, weight: 0.0, targetWeight: 0.0, activityLevel: 0,
                macroType: 0, carbPercent: 25.0, proteinPercent: 35.0, fatPercent: 20.0,
                carbWeight: 0.0, proteinWeight: 0.0, fatWeight: 0.0, manualMacro: false
            },
            clients: [],
            macrosPlans: [],
            updated: false,
            apiUpdate: false,
            savingStatus:'Info Updated'
        };
    }

    setValuesFromDto = () => {
        if (this.state.clients.length > 0) {
            const client = this.state.clients[0];
            this.state.personal.avatar = client.avatar;
            this.state.personal.name = client.firstName + ' ' + client.lastName;
            this.state.personal.age = client.age;
            this.setState({ personal: this.state.personal, apiUpdate: false, updated: !this.state.updated });
        }

        if (this.state.macrosPlans.length > 0) {
            const plan = this.state.macrosPlans[0];
            this.state.personal.height = plan.height;
            this.state.personal.weight = plan.weight;
            this.state.personal.targetWeight = plan.targetWeight;
            this.state.personal.carbPercent = plan.carbPercent;
            this.state.personal.proteinPercent = plan.proteinPercent;
            this.state.personal.fatPercent = plan.fatPercent;
            this.state.personal.carbWeight = plan.carbWeight;
            this.state.personal.proteinWeight = plan.proteinWeight;
            this.state.personal.fatWeight = plan.fatWeight;
            this.state.personal.manualMacro = plan.manual;
            this.state.personal.activityLevel = this.getActivityLevel(plan.activityLevel);
            this.state.personal.macroType = this.getMacroType(plan.macroType);
            this.setState({ personal: this.state.personal });
            this.setState({ apiUpdate: false, updated: !this.state.updated });
        }
    }

    getColour = () => {
        if (this.state.savingStatus === 'Saved' || this.state.savingStatus === 'Info Updated') {
            return 'green';
        }

        return 'red';
    }

    getMacroPercentColor = (percent: number) => {
        if (percent < 100.00) {
            return 'red';
        }

        return 'green';
    }

    showProgressBar = () => {
        if (this.state.savingStatus == 'Saving in progress') {
            return (<Progress inverted color='green' percent={100} active={this.state.savingStatus === 'Saving in progress'} />);
        }
    }

    render() {
        var divLabelStyle = {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: '#fffafa',
            backgroundColor: this.getColour()
        };

        const totalMacros = this.state.personal.carbPercent + this.state.personal.proteinPercent + this.state.personal.fatPercent;
        var divStatusLabelStyle = {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: '#fffafa',
            backgroundColor: this.getMacroPercentColor(totalMacros)
        };

        if (this.props.logins.length > 0) {
            if (this.state.apiUpdate === true) {
                this.setValuesFromDto();
            }
        return (
            <div>
                <Grid centered>
                    <Grid.Row>
                        <Grid.Column width={16}>
                            <AppsMenu activeParentItem='User' activeItem='Macros Setup' logins={this.props.logins} clientDtos={this.state.clients} />
                        </Grid.Column>
                        <Grid.Column width={16}>
                            <div style={divLabelStyle}>
                                <a>{this.state.savingStatus}</a>
                            </div>
                            <Segment textAlign='center' attached='bottom'>
                                <PersonalHeader guides={this.state.macroGuides} personal={this.state.personal} update={this.state.updated} />
                            </Segment>
                        </Grid.Column>
                        <Grid.Column width={16}>
                            {this.getComponent()}
                        </Grid.Column>
                        <Grid.Column width={16}>
                            <div style={divStatusLabelStyle}>
                                <a>Total Macros Calculation: {totalMacros} %</a>
                            </div>
                        </Grid.Column>
                        <Grid.Column width={16}>
                            <Button.Group floated='left' fluid>
                                <Button labelPosition='left' icon floated='left' size='tiny' onClick={this.onCancel} ><Icon size='large' name='cancel' color='red' />Cancel</Button>
                                <Button labelPosition='left' icon floated='left' size='tiny' onClick={this.onSave} ><Icon size='large' name='check' color='green' />Save</Button>
                            </Button.Group>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
                {this.showProgressBar()}
            </div>);
        }
        return (<Redirect to="/" />);
    }
}

//export default connect()(Home);
export default connect(
    (state: ApplicationState) => state.logins, // Selects which state properties are merged into the component's props
    LoginStore.actionCreators // Selects which action creators are merged into the component's props
)(PersonalMacro as any);