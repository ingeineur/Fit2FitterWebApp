import * as React from 'react';
import { Collapse, Container, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';
import { Image, Grid } from 'semantic-ui-react'
import { Link } from 'react-router-dom';
import './NavMenu.css';

export default class NavMenu extends React.PureComponent<{}, { isOpen: boolean }> {
    public state = {
        isOpen: false
    };

    public render() {
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
            alignItems: 'center',
            color: '#fa93a8',
            fontStyle: 'italic',
            fontFamily: 'Arial Rounded MT'
        };

        return (
            <header>
                <Navbar className="navbar-expand-sm navbar-toggleable-sm navbar-dark mb-3 navbar-bg" light>
                    <Container>
                        <NavbarBrand tag={Link} to="/">
                            <Grid>
                                <Grid.Column>
                                    <div>
                                        <h3 className="text-app">Health & Fitness Tracker</h3>
                                    </div>
                                    <div id='text' style={divStyle2}>
                                        <a>by Ida</a>
                                    </div>
                                </Grid.Column>
                            </Grid>
                        </NavbarBrand>
                        <NavbarToggler onClick={this.toggle} className="mr-2"/>
                        <Collapse className="d-sm-inline-flex flex-sm-row-reverse" isOpen={this.state.isOpen} navbar>
                            <ul className="navbar-nav flex-grow">
                                <NavItem>
                                    <NavLink tag={Link} className="text-light" to="/">Home</NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink tag={Link} className="text-light" to="/personal">Macro</NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink tag={Link} className="text-light" to="/measurements">Measurements</NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink tag={Link} className="text-light" to="/macroguide">Meals</NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink tag={Link} className="text-light" to="/activities">Activities</NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink tag={Link} className="text-light" to="/dashboard">Dashboards</NavLink>
                                </NavItem>
                            </ul>
                        </Collapse>
                    </Container>
                </Navbar>
            </header>
        );
    }

    private toggle = () => {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }
}
