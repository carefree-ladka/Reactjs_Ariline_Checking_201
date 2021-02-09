import React, { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  loadPassengers,
  savePassenger
} from "../../redux/actions/passengerAction";
import propTypes from "prop-types";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import AccessibleIcon from "@material-ui/icons/Accessible";
import RestaurantMenuIcon from "@material-ui/icons/RestaurantMenu";
import Checkbox from "@material-ui/core/Checkbox";
import ChildFriendlyIcon from "@material-ui/icons/ChildFriendly";
import SaveIcon from "@material-ui/icons/Save";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FlightIcon from "@material-ui/icons/Flight";
import Tooltip from "@material-ui/core/Tooltip";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1
  },
  paper: {
    padding: theme.spacing(1),
    margin: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary
  },
  button: {
    margin: theme.spacing(1),
    textAlign: "center"
  },
  corridor: {
    margin: theme.spacing(1)
  }
}));

function CheckInPassengerPage() {
  //const checkInPassengers= useSelector(state=>state.checkInPassengers)
  const passengers = useSelector((state) => state.passengers);
  const ancillaryServices = useSelector((state) => state.ancillaryServices);
  const dispatch = useDispatch();

  let ancillaryServiceLookUp = {};
  let passengersLookUp = {};
  const seatColors = [{ A1: "primary", A2: "secondary" }];
  const initialPassenger = {
    name: "",
    passport: "",
    address: "",
    dob: "",
    infant: false,
    weelchair: false,
    specialMeals: false,
    flight: "",
    seatno: "",
    id: "",
    createdAt: "",
    checkedIn: false
  };
  const [selectedPassenger, setSelectedPassenger] = React.useState(
    initialPassenger
  );

  const [selectedFlight, setFlight] = React.useState(1);

  const [filter, setFilter] = React.useState({
    weelchair: false,
    infant: false,
    specialMeals: false,
    checkedIn: false
  });

  const seatColumns = ["A", "B", "C"];
  const seatRows = ["1", "2", "3"];

  if (passengers.length > 0) {
    passengers.map((passengers) => {
      passengersLookUp[passengers.id] = passengers.name;
    });
  }
  if (ancillaryServices.length > 0) {
    ancillaryServices.map((ancillaryService) => {
      ancillaryServiceLookUp[ancillaryService.id] = ancillaryService.service;
    });
  }

  const loadAsyncData = useCallback(async () => {
    try {
      await dispatch(
        loadPassengers({
          mandarotyFileds: false,
          flight: selectedFlight
        })
      );
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  }, [selectedFlight, dispatch]);

  useEffect(() => {
    loadAsyncData();
    //cleanup function
    return () => {
      loadAsyncData();
    };
  }, [loadAsyncData]);

  const handleCheckedIn = (event) => {
    setSelectedPassenger({
      ...selectedPassenger,
      checkedIn: event.target.checked
    });
  };

  const handleWeelchair = (event) => {
    setSelectedPassenger({
      ...selectedPassenger,
      weelchair: event.target.checked
    });
  };

  const handleInfant = (event) => {
    setSelectedPassenger({
      ...selectedPassenger,
      infant: event.target.checked
    });
  };

  const handleSpecialMeals = (event) => {
    setSelectedPassenger({
      ...selectedPassenger,
      specialMeals: event.target.checked
    });
  };

  const handleSeatNo = (event) => {
    setSelectedPassenger({
      ...selectedPassenger,
      seatno: event.target.value
    });
  };

  const handleWeelChairFilter = (event) => {
    setFilter({
      ...filter,
      weelchair: event.target.checked
    });
  };

  const handleInfantFilter = (event) => {
    setFilter({
      ...filter,
      infant: event.target.checked
    });
  };

  const handleSpecialMealsFilter = (event) => {
    setFilter({
      ...filter,
      specialMeals: event.target.checked
    });
  };

  const handleCheckedInFilter = (event) => {
    setFilter({
      ...filter,
      checkedIn: event.target.checked
    });
  };

  const classes = useStyles();

  function setPassengerCheckIn(passenger) {
    setSelectedPassenger(passenger);
  }

  function handleSave(passenger) {
    dispatch(savePassenger(passenger));
    setSelectedPassenger(initialPassenger);
    loadSeatNo();
  }

  function loadSeatNo() {
    const seatNumbers = ["A1", "B1", "C1", "A2", "B2", "C2", "A3", "B3", "C3"];

    let optionItems = seatNumbers.map((item) =>
      passengers.find((o) => o.seatno === item) === undefined ? (
        <MenuItem key={item} value={item}>
          {item}
        </MenuItem>
      ) : (
        <MenuItem disabled key={item} value={item}>
          {item}
        </MenuItem>
      )
    );
    return optionItems;
  }

  function isPassengerCheckedIn(seatno) {
    let checkedIn = false;
    let passenger = {};
    passengers.map((item) => {
      if (item.seatno === seatno) {
        checkedIn = true;
        passenger = item;
      }
    });

    if (
      (filter.checkedIn === true && passenger.checkedIn !== true) ||
      (filter.weelchair === true && passenger.weelchair !== true) ||
      (filter.infant === true && passenger.infant !== true) ||
      (filter.specialMeals === true && passenger.specialMeals !== true)
    ) {
      return false;
    }

    if (checkedIn) {
      return (
        <React.Fragment>
          <Tooltip title={passenger.name} aria-label="add">
            <Button
              className={classes.button}
              variant="contained"
              color={
                passenger.seatno === "A1" ||
                passenger.seatno === "B1" ||
                passenger.seatno === "C1"
                  ? "default"
                  : "secondary"
              }
              onClick={(event) => {
                setPassengerCheckIn(passenger);
              }}
            >
              {seatno}
              <AccessibleIcon
                color={passenger.weelchair ? "default" : "primary"}
              />
              <ChildFriendlyIcon
                color={passenger.infant ? "default" : "primary"}
              />
              <RestaurantMenuIcon
                color={passenger.specialMeals ? "default" : "primary"}
              />

              <CheckCircleIcon
                color={passenger.checkedIn ? "default" : "primary"}
              ></CheckCircleIcon>
            </Button>
          </Tooltip>
        </React.Fragment>
      );
    } else {
      return (
        <Button
          disabled
          className={classes.button}
          variant="contained"
          onClick={(event) => {
            setPassengerCheckIn({});
          }}
        >
          {seatno}
          <AccessibleIcon />
          <ChildFriendlyIcon />
          <RestaurantMenuIcon />
          <CheckCircleIcon />
        </Button>
      );
    }
  }

  return (
    <React.Fragment>
      <div className={classes.root}>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <Paper
              className={classes.paper}
              style={{ backgroundColor: "#A0DAA9" }}
            >
              <Grid item xs={12}>
                <div>
                  <List>
                    <ListItem>
                      <Button
                        variant="contained"
                        color={selectedFlight === 1 ? "primary" : "default"}
                        className={classes.button}
                        startIcon={<FlightIcon />}
                        onClick={(event) => {
                          setFlight(1);
                        }}
                      >
                        Flight 1 (11:00 AM)
                      </Button>

                      <Button
                        variant="contained"
                        color={selectedFlight === 2 ? "primary" : "default"}
                        className={classes.button}
                        startIcon={<FlightIcon />}
                        onClick={(event) => {
                          setFlight(2);
                        }}
                      >
                        Flight 2 (1:00 PM)
                      </Button>
                      <Button
                        variant="contained"
                        color={selectedFlight === 3 ? "primary" : "default"}
                        className={classes.button}
                        startIcon={<FlightIcon />}
                        onClick={(event) => {
                          setFlight(3);
                        }}
                      >
                        Flight 3 (20:00 PM)
                      </Button>
                    </ListItem>
                  </List>
                </div>
              </Grid>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper
              className={classes.paper}
              style={{ backgroundColor: "#A0DAA9" }}
            >
              Filter:
              <Checkbox
                checked={filter.weelchair}
                onChange={(event) => {
                  handleWeelChairFilter(event);
                }}
                inputProps={{
                  "aria-label": "primary checkbox"
                }}
              />
              <AccessibleIcon /> Passenger required weelchair
              <Checkbox
                checked={filter.infant}
                onChange={(event) => {
                  handleInfantFilter(event);
                }}
                inputProps={{
                  "aria-label": "primary checkbox"
                }}
              />
              <ChildFriendlyIcon /> Passenger with infant
              <Checkbox
                checked={filter.specialMeals}
                onChange={(event) => {
                  handleSpecialMealsFilter(event);
                }}
                inputProps={{
                  "aria-label": "primary checkbox"
                }}
              />
              <RestaurantMenuIcon /> Passenger requested special meal
              <Checkbox
                checked={filter.checkedIn}
                onChange={(event) => {
                  handleCheckedInFilter(event);
                }}
                inputProps={{
                  "aria-label": "primary checkbox"
                }}
              />
              <CheckCircleIcon /> Passenger checked in
            </Paper>
          </Grid>
          <Grid item xs={8} justify="space-between">
            {seatColumns.map((seatColumn) => (
              // eslint-disable-next-line react/jsx-key
              <Paper
                className={classes.paper}
                style={{ backgroundColor: "#A0DAA9" }}
              >
                {seatRows.map((seatRow) =>
                  isPassengerCheckedIn(seatColumn + seatRow)
                )}
              </Paper>
            ))}
          </Grid>

          <Grid item xs={4}>
            <Paper
              className={classes.paper}
              style={{ backgroundColor: "#A0DAA9" }}
            >
              <List component="nav" className={classes.root}>
                <ListItem divider>
                  <ListItemText primary="Passenger Details" />
                  <Button
                    variant="contained"
                    color="primary"
                    disabled={!selectedPassenger.name.length}
                    className={classes.button}
                    startIcon={<SaveIcon />}
                    onClick={(event) => {
                      handleSave(selectedPassenger);
                    }}
                  >
                    SAVE
                  </Button>
                </ListItem>
                <ListItem divider>
                  <ListItemText primary="Checked In" />
                  <Checkbox
                    checked={selectedPassenger.checkedIn}
                    onChange={handleCheckedIn}
                    inputProps={{
                      "aria-label": "primary checkbox"
                    }}
                  />
                </ListItem>
                <ListItem divider>
                  <ListItemText primary="Seat No" />
                  <Select
                    value={selectedPassenger.seatno}
                    onChange={handleSeatNo}
                  >
                    {loadSeatNo()}
                  </Select>
                </ListItem>
                <ListItem divider>
                  <ListItemText primary="Name" />
                  {selectedPassenger.name}
                </ListItem>
                <Divider />
                <ListItem divider>
                  <ListItemText primary="Passport" />
                  {selectedPassenger.passport}
                </ListItem>
                <ListItem divider>
                  <ListItemText primary="Address" />
                  {selectedPassenger.address}
                </ListItem>
                <ListItem divider>
                  <ListItemText primary="DOB" />
                  {selectedPassenger.dob}
                </ListItem>
                <Checkbox
                  checked={selectedPassenger.weelchair}
                  onChange={handleWeelchair}
                  inputProps={{
                    "aria-label": "primary checkbox"
                  }}
                />
                <AccessibleIcon
                  color={!selectedPassenger.weelchair ? "default" : "primary"}
                />
                <Checkbox
                  checked={selectedPassenger.infant}
                  onChange={handleInfant}
                  inputProps={{
                    "aria-label": "primary checkbox"
                  }}
                />
                <ChildFriendlyIcon
                  color={!selectedPassenger.infant ? "default" : "primary"}
                />
                <Checkbox
                  checked={selectedPassenger.specialMeals}
                  onChange={handleSpecialMeals}
                  inputProps={{
                    "aria-label": "primary checkbox"
                  }}
                />
                <RestaurantMenuIcon
                  color={
                    !selectedPassenger.specialMeals ? "default" : "primary"
                  }
                />

                <Divider light />
              </List>
            </Paper>
          </Grid>
        </Grid>
      </div>
    </React.Fragment>
  );
}

CheckInPassengerPage.propTypes = {
  checkInPassengers: propTypes.array.isRequired,
  passengers: propTypes.array.isRequired,
  ancillaryServices: propTypes.array.isRequired,
  loadCheckInPassengers: propTypes.func.isRequired,
  saveCheckInPassenger: propTypes.func.isRequired,
  deleteCheckInPassenger: propTypes.func.isRequired,
  loadAncillaryServices: propTypes.func.isRequired,
  loadPassengers: propTypes.func.isRequired,
  savePassenger: propTypes.func.isRequired
};

export default CheckInPassengerPage;
