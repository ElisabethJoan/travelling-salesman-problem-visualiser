import * as React from "react";
import { Button, Slider } from "@mui/material";

import {
  nearestNeighbour,
  nearestInsertion,
  farthestInsertion,
  cheapestInsertion,
  convexHull,
  nodeInsertion,
  edgeInsertion,
  twoOpt,
} from "./algorithms";

export const Interface = (props) => {
    return (
        <div className="interface">
            <div className="algoButtons">
                <h5>Constructed Heuristics</h5>
                <ul>
                    <li>
                        <Button
                            variant="outlined"
                            onClick={() => {
                                props.reset(props.cities);
                                props.displayPath(nearestNeighbour(props.cities));
                            }}
                        >
                            Nearest Neighbour
                        </Button>
                    </li>
                    <li>
                        <Button
                            variant="outlined"
                            onClick={() => {
                                props.reset(props.cities);
                                props.displayPath(cheapestInsertion(props.cities));
                            }}
                        >
                            Cheapest Insertion
                        </Button>
                    </li>
                    <li>
                        <Button
                            variant="outlined"
                            onClick={() => {
                                props.reset(props.cities);
                                props.displayPath(nearestInsertion(props.cities));
                            }}
                        >
                            Nearest Insertion
                        </Button>
                    </li>
                    <li>
                        <Button
                            variant="outlined"
                            onClick={() => {
                                props.reset(props.cities);
                                props.displayPath(farthestInsertion(props.cities));
                            }}
                        >
                            Farthest Insertion
                        </Button>
                    </li>
                    <li>
                        <Button
                            variant="outlined"
                            onClick={() => {
                                props.reset(props.cities);
                                props.displayPath(convexHull(props.cities));
                            }}
                        >
                            Convex Hull
                        </Button>
                    </li>
                </ul>
            </div>
            <div className="algoButtons">
                <h5>Optimisation Heuristics</h5>
                <ul>
                    <li>
                        <Button
                            variant="outlined"
                            onClick={() => {
                                props.reset(props.cities);
                                props.setLines([]);
                                props.displayOptimisation(twoOpt(props.cities));
                            }}
                        >
                            2-Opt
                        </Button>
                    </li>
                    <li>
                        <Button
                            variant="outlined"
                            onClick={() => {
                                props.reset(props.cities);
                                props.setLines([]);
                                props.displayOptimisation(nodeInsertion(props.cities));
                            }}
                        >
                            Node Insertion
                        </Button>
                    </li>
                    <li>
                        <Button
                            variant="outlined"
                            onClick={() => {
                                props.reset(props.cities);
                                props.setLines([]);
                                props.displayOptimisation(edgeInsertion(props.cities));
                            }}
                        >
                            Edge Insertion
                        </Button>
                  </li>
                </ul>
            </div>
            <div className="settings">
                <ul>
                    <li>
                        <h5>Settings</h5>
                    </li>
                    <li>
                        <Button
                            variant="outlined"
                            onClick={() => props.begin()}
                        >
                            Generate New Array     
                        </Button>
                    </li>
                    <li>
                        <h5>Animation Delay</h5>
                        <Slider
                            min={5}
                            step={5}
                            max={100}
                            value={props.animationDelay}
                            onChange={(_, value) => {
                                props.setAnimationDelay(value);
                            }}
                        />
                    </li>
                    <li>
                        <h5>City Count</h5>
                        <Slider
                            min={6}
                            step={1}
                            max={50}
                            value={props.numPoints}
                            onChange={(_, value) => {
                                props.setNumPoints(value);
                                props.begin();
                            }}
                        />
                    </li>
                </ul>
            </div>
        </div>
    );
}
