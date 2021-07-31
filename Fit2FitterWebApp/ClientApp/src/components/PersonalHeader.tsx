import * as React from 'react';
import { connect } from 'react-redux';
import { Grid } from 'semantic-ui-react';
import { IPersonal } from '../models/clients'
import { isNull } from 'util';

interface IProps {
    guides: IMacroGuides;
    personal: IPersonal;
    update: boolean;
}

interface IMacroGuides {
    carb: number;
    protein: number;
    fat: number;
    veg: number;
    bodyFat: number;
}

interface IState {
    username: string;
    password: string;
    updated: boolean;
}

class PersonalHeader extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);
        this.state = {
            username: '', password: '', updated: false
        };
    }

    getActivityLevel = () => {
        if (this.props.personal.activityLevel == 0) {
            return 1.2;
        }

        if (this.props.personal.activityLevel == 1) {
            return 1.375;
        }

        if (this.props.personal.activityLevel == 2) {
            return 1.55;
        }

        if (this.props.personal.activityLevel == 3) {
            return 1.725;
        }

        if (this.props.personal.activityLevel == 4) {
            return 1.9;
        }

        return 0;
    }

    render() {

        var divLabelStyle1 = {
            color: 'black'
        };

        var divLabelStyle2 = {
            color: 'black'
        };

        var divLabelStyle3 = {
            color: 'black'
        };

        var divLabelStyle4 = {
            color: 'black',
            fontSize: '15px'
        };

        let carb = isNull(this.props.personal.carbWeight) ? '0.0' : this.props.personal.carbWeight.toString();
        let protein = isNull(this.props.personal.proteinWeight) ? '0.0' : this.props.personal.proteinWeight.toString();
        let fat = isNull(this.props.personal.fatWeight) ? '0.0' : this.props.personal.fatWeight.toString();

        if (isNull(this.props.personal.manualMacro) || this.props.personal.manualMacro === false) {
            const bmr = (10 * this.props.personal.weight) + (6.25 * this.props.personal.height) - (5 * this.props.personal.age) - 161;
            const totalCalories = this.getActivityLevel() * bmr;
            carb = ((this.props.personal.carbPercent / 100.0 * totalCalories) / 4).toFixed(2);
            protein = ((this.props.personal.proteinPercent / 100.0 * totalCalories) / 4).toFixed(2);
            fat = ((this.props.personal.fatPercent / 100.0 * totalCalories) / 9).toFixed(2);
        }
        
        return (
            <Grid centered>
                <Grid.Row divided columns={3} textAlign='center'>
                    <Grid.Column color='yellow' textAlign='center'>
                        <div><a>Carb(g)</a></div>
                        <div style={divLabelStyle1}><a>{carb}</a></div>
                    </Grid.Column>
                    <Grid.Column color='yellow' textAlign='center'>
                        <div><a>Protein(g)</a></div>
                        <div style={divLabelStyle2}><a>{protein}</a></div>
                    </Grid.Column>
                    <Grid.Column color='yellow' textAlign='center'>
                        <div><a>Fat(g)</a></div>
                        <div style={divLabelStyle3}><a>{fat}</a></div>
                    </Grid.Column>
                </Grid.Row>
            </Grid>);
    }
}

export default connect()(PersonalHeader);