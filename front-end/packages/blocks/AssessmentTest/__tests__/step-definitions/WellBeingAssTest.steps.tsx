// @ts-nocheck
import { defineFeature, loadFeature} from "jest-cucumber"
import { shallow, ShallowWrapper } from 'enzyme'

import * as helpers from '../../../../framework/src/Helpers'
import {runEngine} from '../../../../framework/src/RunEngine'
import {Message} from "../../../../framework/src/Message"

import MessageEnum, {getName} from "../../../../framework/src/Messages/MessageEnum"; 
import React from "react";
import WellBeingAssTest from "../../src/WellBeingAssTest"

const navigation = require("react-navigation")

const screenProps = {
    navigation: navigation,
    id: "WellBeingAssTest"
  }
const qtnData= {
    "data": [
        {
            "id": "1",
            "type": "question",
            "attributes": {
                "question_answers": {
                    "question": {
                        "id": 1,
                        "question": "Have you been able to concentrate on what you're doing in the past few weeks?",
                        "category_id": 1,
                        "subcategory_id": null,
                        "created_at": "2022-10-31T04:37:41.234Z",
                        "updated_at": "2022-11-02T05:42:46.892Z"
                    },
                    "answers": [
                        {
                            "id": 4,
                            "answer": "much less than usual ",
                            "score": "0",
                            "question_well_being_id": 1,
                            "created_at": "2022-10-31T04:37:41.265Z",
                            "updated_at": "2022-11-14T05:40:51.756Z"
                        },
                        {
                            "id": 1,
                            "answer": " better than usual ",
                            "score": "3",
                            "question_well_being_id": 1,
                            "created_at": "2022-10-31T04:37:41.240Z",
                            "updated_at": "2022-11-14T05:40:51.761Z"
                        },
                        {
                            "id": 2,
                            "answer": "same as usual ",
                            "score": "2",
                            "question_well_being_id": 1,
                            "created_at": "2022-10-31T04:37:41.243Z",
                            "updated_at": "2022-11-14T05:40:51.762Z"
                        },
                        {
                            "id": 3,
                            "answer": "less than usual ",
                            "score": "1",
                            "question_well_being_id": 1,
                            "created_at": "2022-10-31T04:37:41.246Z",
                            "updated_at": "2022-11-14T05:40:51.765Z"
                        }
                    ]
                }
            }
        },
        {
            "id": "3",
            "type": "question",
            "attributes": {
                "question_answers": {
                    "question": {
                        "id": 3,
                        "question": "I would describe my overall eating habits",
                        "category_id": 1,
                        "subcategory_id": 1,
                        "created_at": "2022-11-02T06:12:21.482Z",
                        "updated_at": "2022-11-02T06:12:21.482Z"
                    },
                    "answers": [
                        {
                            "id": 9,
                            "answer": "Excellent",
                            "score": "5",
                            "question_well_being_id": 3,
                            "created_at": "2022-11-02T06:12:21.486Z",
                            "updated_at": "2022-11-02T06:12:21.486Z"
                        },
                        {
                            "id": 10,
                            "answer": "Good",
                            "score": "4",
                            "question_well_being_id": 3,
                            "created_at": "2022-11-02T06:12:21.488Z",
                            "updated_at": "2022-11-02T06:12:21.488Z"
                        },
                        {
                            "id": 11,
                            "answer": "Fair",
                            "score": "3",
                            "question_well_being_id": 3,
                            "created_at": "2022-11-02T06:12:21.490Z",
                            "updated_at": "2022-11-02T06:12:21.490Z"
                        },
                        {
                            "id": 12,
                            "answer": "Poor",
                            "score": "2",
                            "question_well_being_id": 3,
                            "created_at": "2022-11-02T06:12:21.492Z",
                            "updated_at": "2022-11-02T06:12:21.492Z"
                        },
                        {
                            "id": 13,
                            "answer": "Terrible",
                            "score": "1",
                            "question_well_being_id": 3,
                            "created_at": "2022-11-02T06:12:21.494Z",
                            "updated_at": "2022-11-02T06:12:21.494Z"
                        }
                    ]
                }
            }
        },
        {
            "id": "4",
            "type": "question",
            "attributes": {
                "question_answers": {
                    "question": {
                        "id": 4,
                        "question": "I tend to exercise. ",
                        "category_id": 1,
                        "subcategory_id": 3,
                        "created_at": "2022-11-02T06:14:20.628Z",
                        "updated_at": "2022-11-02T06:14:20.628Z"
                    },
                    "answers": [
                        {
                            "id": 14,
                            "answer": "Less Than once a wee",
                            "score": "1",
                            "question_well_being_id": 4,
                            "created_at": "2022-11-02T06:14:20.634Z",
                            "updated_at": "2022-11-02T06:14:20.634Z"
                        },
                        {
                            "id": 15,
                            "answer": "at least once a week",
                            "score": "2",
                            "question_well_being_id": 4,
                            "created_at": "2022-11-02T06:14:20.637Z",
                            "updated_at": "2022-11-02T06:14:20.637Z"
                        },
                        {
                            "id": 16,
                            "answer": "at least twice a week",
                            "score": "3",
                            "question_well_being_id": 4,
                            "created_at": "2022-11-02T06:14:20.638Z",
                            "updated_at": "2022-11-02T06:14:20.638Z"
                        },
                        {
                            "id": 17,
                            "answer": "at least thrice a week",
                            "score": "4",
                            "question_well_being_id": 4,
                            "created_at": "2022-11-02T06:14:20.641Z",
                            "updated_at": "2022-11-02T06:14:20.641Z"
                        },
                        {
                            "id": 18,
                            "answer": "More than thrice a week",
                            "score": "5",
                            "question_well_being_id": 4,
                            "created_at": "2022-11-02T06:14:20.643Z",
                            "updated_at": "2022-11-02T06:14:20.643Z"
                        }
                    ]
                }
            }
        },
        {
            "id": "5",
            "type": "question",
            "attributes": {
                "question_answers": {
                    "question": {
                        "id": 5,
                        "question": "I’m able to take moments for myself throughout the day. ",
                        "category_id": 1,
                        "subcategory_id": 2,
                        "created_at": "2022-11-02T06:16:53.901Z",
                        "updated_at": "2022-11-02T06:16:53.901Z"
                    },
                    "answers": [
                        {
                            "id": 19,
                            "answer": "Strongly Agree",
                            "score": "5",
                            "question_well_being_id": 5,
                            "created_at": "2022-11-02T06:16:53.906Z",
                            "updated_at": "2022-11-02T06:16:53.906Z"
                        },
                        {
                            "id": 20,
                            "answer": "Agree",
                            "score": "4",
                            "question_well_being_id": 5,
                            "created_at": "2022-11-02T06:16:53.908Z",
                            "updated_at": "2022-11-02T06:16:53.908Z"
                        },
                        {
                            "id": 21,
                            "answer": "Niether agree nor disagree",
                            "score": "3",
                            "question_well_being_id": 5,
                            "created_at": "2022-11-02T06:16:53.915Z",
                            "updated_at": "2022-11-02T06:16:53.915Z"
                        },
                        {
                            "id": 22,
                            "answer": "Disagree",
                            "score": "2",
                            "question_well_being_id": 5,
                            "created_at": "2022-11-02T06:16:53.917Z",
                            "updated_at": "2022-11-02T06:16:53.917Z"
                        },
                        {
                            "id": 23,
                            "answer": "Strongly disagree",
                            "score": "1",
                            "question_well_being_id": 5,
                            "created_at": "2022-11-02T06:16:53.919Z",
                            "updated_at": "2022-11-02T06:16:53.919Z"
                        }
                    ]
                }
            }
        },
        {
            "id": "17",
            "type": "question",
            "attributes": {
                "question_answers": {
                    "question": {
                        "id": 17,
                        "question": "I consciously eat a healthy diet low in processed foods and sugar.",
                        "category_id": 1,
                        "subcategory_id": 1,
                        "created_at": "2022-11-02T06:42:30.174Z",
                        "updated_at": "2022-11-02T06:42:30.174Z"
                    },
                    "answers": [
                        {
                            "id": 71,
                            "answer": "Strongly Agree",
                            "score": "5",
                            "question_well_being_id": 17,
                            "created_at": "2022-11-02T06:42:30.177Z",
                            "updated_at": "2022-11-02T06:42:30.177Z"
                        },
                        {
                            "id": 72,
                            "answer": "Agree",
                            "score": "4",
                            "question_well_being_id": 17,
                            "created_at": "2022-11-02T06:42:30.179Z",
                            "updated_at": "2022-11-02T06:42:30.179Z"
                        },
                        {
                            "id": 73,
                            "answer": "Niether agree nor disagree",
                            "score": "3",
                            "question_well_being_id": 17,
                            "created_at": "2022-11-02T06:42:30.181Z",
                            "updated_at": "2022-11-02T06:42:30.181Z"
                        },
                        {
                            "id": 74,
                            "answer": "Disagree",
                            "score": "2",
                            "question_well_being_id": 17,
                            "created_at": "2022-11-02T06:42:30.182Z",
                            "updated_at": "2022-11-02T06:42:30.182Z"
                        },
                        {
                            "id": 75,
                            "answer": "Strongly disagree",
                            "score": "1",
                            "question_well_being_id": 17,
                            "created_at": "2022-11-02T06:42:30.184Z",
                            "updated_at": "2022-11-02T06:42:30.184Z"
                        }
                    ]
                }
            }
        },
        {
            "id": "18",
            "type": "question",
            "attributes": {
                "question_answers": {
                    "question": {
                        "id": 18,
                        "question": "I make a conscious effort to move my body throughout the day.",
                        "category_id": 1,
                        "subcategory_id": 3,
                        "created_at": "2022-11-02T06:44:06.351Z",
                        "updated_at": "2022-11-02T06:44:06.351Z"
                    },
                    "answers": [
                        {
                            "id": 76,
                            "answer": "Strongly Agree",
                            "score": "5",
                            "question_well_being_id": 18,
                            "created_at": "2022-11-02T06:44:06.356Z",
                            "updated_at": "2022-11-02T06:44:06.356Z"
                        },
                        {
                            "id": 77,
                            "answer": "Agree",
                            "score": "4",
                            "question_well_being_id": 18,
                            "created_at": "2022-11-02T06:44:06.359Z",
                            "updated_at": "2022-11-02T06:44:06.359Z"
                        },
                        {
                            "id": 78,
                            "answer": "Niether agree nor disagree",
                            "score": "3",
                            "question_well_being_id": 18,
                            "created_at": "2022-11-02T06:44:06.360Z",
                            "updated_at": "2022-11-02T06:44:06.360Z"
                        },
                        {
                            "id": 79,
                            "answer": "Disagree",
                            "score": "2",
                            "question_well_being_id": 18,
                            "created_at": "2022-11-02T06:44:06.363Z",
                            "updated_at": "2022-11-02T06:44:06.363Z"
                        },
                        {
                            "id": 80,
                            "answer": "Strongly disagree",
                            "score": "1",
                            "question_well_being_id": 18,
                            "created_at": "2022-11-02T06:44:06.365Z",
                            "updated_at": "2022-11-02T06:44:06.365Z"
                        }
                    ]
                }
            }
        },
        {
            "id": "19",
            "type": "question",
            "attributes": {
                "question_answers": {
                    "question": {
                        "id": 19,
                        "question": "I can create uninterrupted time in a day for myself without distraction.",
                        "category_id": 1,
                        "subcategory_id": 2,
                        "created_at": "2022-11-02T06:45:14.015Z",
                        "updated_at": "2022-11-02T06:45:14.015Z"
                    },
                    "answers": [
                        {
                            "id": 81,
                            "answer": "Strongly Agree",
                            "score": "5",
                            "question_well_being_id": 19,
                            "created_at": "2022-11-02T06:45:14.019Z",
                            "updated_at": "2022-11-02T06:45:14.019Z"
                        },
                        {
                            "id": 82,
                            "answer": "Agree",
                            "score": "4",
                            "question_well_being_id": 19,
                            "created_at": "2022-11-02T06:45:14.021Z",
                            "updated_at": "2022-11-02T06:45:14.021Z"
                        },
                        {
                            "id": 83,
                            "answer": "Niether agree nor disagree",
                            "score": "3",
                            "question_well_being_id": 19,
                            "created_at": "2022-11-02T06:45:14.022Z",
                            "updated_at": "2022-11-02T06:45:14.022Z"
                        },
                        {
                            "id": 84,
                            "answer": "Disagree",
                            "score": "2",
                            "question_well_being_id": 19,
                            "created_at": "2022-11-02T06:45:14.024Z",
                            "updated_at": "2022-11-02T06:45:14.024Z"
                        },
                        {
                            "id": 85,
                            "answer": "Strongly disagree",
                            "score": "1",
                            "question_well_being_id": 19,
                            "created_at": "2022-11-02T06:45:14.026Z",
                            "updated_at": "2022-11-02T06:45:14.026Z"
                        }
                    ]
                }
            }
        },
        {
            "id": "20",
            "type": "question",
            "attributes": {
                "question_answers": {
                    "question": {
                        "id": 20,
                        "question": "I have enough energy throughout the day and rarely feel tired or exhausted",
                        "category_id": 1,
                        "subcategory_id": 2,
                        "created_at": "2022-11-02T06:46:12.429Z",
                        "updated_at": "2022-11-02T06:46:12.429Z"
                    },
                    "answers": [
                        {
                            "id": 86,
                            "answer": "Strongly Agree",
                            "score": "5",
                            "question_well_being_id": 20,
                            "created_at": "2022-11-02T06:46:12.432Z",
                            "updated_at": "2022-11-02T06:46:12.432Z"
                        },
                        {
                            "id": 87,
                            "answer": "Agree",
                            "score": "4",
                            "question_well_being_id": 20,
                            "created_at": "2022-11-02T06:46:12.435Z",
                            "updated_at": "2022-11-02T06:46:12.435Z"
                        },
                        {
                            "id": 88,
                            "answer": "Niether agree nor disagree",
                            "score": "3",
                            "question_well_being_id": 20,
                            "created_at": "2022-11-02T06:46:12.437Z",
                            "updated_at": "2022-11-02T06:46:12.437Z"
                        },
                        {
                            "id": 89,
                            "answer": "Disagree",
                            "score": "2",
                            "question_well_being_id": 20,
                            "created_at": "2022-11-02T06:46:12.439Z",
                            "updated_at": "2022-11-02T06:46:12.439Z"
                        },
                        {
                            "id": 90,
                            "answer": "Strongly disagree",
                            "score": "1",
                            "question_well_being_id": 20,
                            "created_at": "2022-11-02T06:46:12.441Z",
                            "updated_at": "2022-11-02T06:46:12.441Z"
                        }
                    ]
                }
            }
        },
        {
            "id": "21",
            "type": "question",
            "attributes": {
                "question_answers": {
                    "question": {
                        "id": 21,
                        "question": "I feel well rested and ready when waking up in the morning. ",
                        "category_id": 1,
                        "subcategory_id": 8,
                        "created_at": "2022-11-02T06:48:19.205Z",
                        "updated_at": "2022-11-02T06:48:19.205Z"
                    },
                    "answers": [
                        {
                            "id": 91,
                            "answer": "Strongly Agree",
                            "score": "5",
                            "question_well_being_id": 21,
                            "created_at": "2022-11-02T06:48:19.209Z",
                            "updated_at": "2022-11-02T06:48:19.209Z"
                        },
                        {
                            "id": 92,
                            "answer": "Agree",
                            "score": "4",
                            "question_well_being_id": 21,
                            "created_at": "2022-11-02T06:48:19.211Z",
                            "updated_at": "2022-11-02T06:48:19.211Z"
                        },
                        {
                            "id": 93,
                            "answer": "Niether agree nor disagree",
                            "score": "3",
                            "question_well_being_id": 21,
                            "created_at": "2022-11-02T06:48:19.214Z",
                            "updated_at": "2022-11-02T06:48:19.214Z"
                        },
                        {
                            "id": 94,
                            "answer": "Disagree",
                            "score": "2",
                            "question_well_being_id": 21,
                            "created_at": "2022-11-02T06:48:19.216Z",
                            "updated_at": "2022-11-02T06:48:19.216Z"
                        },
                        {
                            "id": 95,
                            "answer": "Strongly disagree",
                            "score": "1",
                            "question_well_being_id": 21,
                            "created_at": "2022-11-02T06:48:19.218Z",
                            "updated_at": "2022-11-02T06:48:19.218Z"
                        }
                    ]
                }
            }
        },
        {
            "id": "22",
            "type": "question",
            "attributes": {
                "question_answers": {
                    "question": {
                        "id": 22,
                        "question": "I get an adequate amount of deep, restful sleep every day.",
                        "category_id": 1,
                        "subcategory_id": 8,
                        "created_at": "2022-11-02T06:49:15.227Z",
                        "updated_at": "2022-11-02T06:49:15.227Z"
                    },
                    "answers": [
                        {
                            "id": 96,
                            "answer": "Strongly Agree",
                            "score": "5",
                            "question_well_being_id": 22,
                            "created_at": "2022-11-02T06:49:15.230Z",
                            "updated_at": "2022-11-02T06:49:15.230Z"
                        },
                        {
                            "id": 97,
                            "answer": "Agree",
                            "score": "4",
                            "question_well_being_id": 22,
                            "created_at": "2022-11-02T06:49:15.231Z",
                            "updated_at": "2022-11-02T06:49:15.231Z"
                        },
                        {
                            "id": 98,
                            "answer": "Niether agree nor disagree",
                            "score": "3",
                            "question_well_being_id": 22,
                            "created_at": "2022-11-02T06:49:15.232Z",
                            "updated_at": "2022-11-02T06:49:15.232Z"
                        },
                        {
                            "id": 99,
                            "answer": "Disagree",
                            "score": "2",
                            "question_well_being_id": 22,
                            "created_at": "2022-11-02T06:49:15.233Z",
                            "updated_at": "2022-11-02T06:49:15.233Z"
                        },
                        {
                            "id": 100,
                            "answer": "Strongly disagree",
                            "score": "1",
                            "question_well_being_id": 22,
                            "created_at": "2022-11-02T06:49:15.234Z",
                            "updated_at": "2022-11-02T06:49:15.234Z"
                        }
                    ]
                }
            }
        },
        {
            "id": "23",
            "type": "question",
            "attributes": {
                "question_answers": {
                    "question": {
                        "id": 23,
                        "question": "How often do you smoke cigarettes?",
                        "category_id": 1,
                        "subcategory_id": 9,
                        "created_at": "2022-11-02T06:51:07.318Z",
                        "updated_at": "2022-11-02T06:51:07.318Z"
                    },
                    "answers": [
                        {
                            "id": 101,
                            "answer": "Never",
                            "score": "0",
                            "question_well_being_id": 23,
                            "created_at": "2022-11-02T06:51:07.322Z",
                            "updated_at": "2022-11-02T06:51:07.322Z"
                        },
                        {
                            "id": 102,
                            "answer": "Occasionally",
                            "score": "1",
                            "question_well_being_id": 23,
                            "created_at": "2022-11-02T06:51:07.324Z",
                            "updated_at": "2022-11-02T06:51:07.324Z"
                        },
                        {
                            "id": 103,
                            "answer": "Thrice a week",
                            "score": "2",
                            "question_well_being_id": 23,
                            "created_at": "2022-11-02T06:51:07.326Z",
                            "updated_at": "2022-11-02T06:51:07.326Z"
                        },
                        {
                            "id": 104,
                            "answer": "More than thrice a week",
                            "score": "3",
                            "question_well_being_id": 23,
                            "created_at": "2022-11-02T06:51:07.329Z",
                            "updated_at": "2022-11-14T10:14:49.962Z"
                        }
                    ]
                }
            }
        },
        {
            "id": "24",
            "type": "question",
            "attributes": {
                "question_answers": {
                    "question": {
                        "id": 24,
                        "question": "How often do you consume alcohol?",
                        "category_id": 1,
                        "subcategory_id": 9,
                        "created_at": "2022-11-02T06:52:36.163Z",
                        "updated_at": "2022-11-02T06:52:36.163Z"
                    },
                    "answers": [
                        {
                            "id": 105,
                            "answer": "Never",
                            "score": "0",
                            "question_well_being_id": 24,
                            "created_at": "2022-11-02T06:52:36.168Z",
                            "updated_at": "2022-11-02T06:52:36.168Z"
                        },
                        {
                            "id": 106,
                            "answer": "Occasionally",
                            "score": "1",
                            "question_well_being_id": 24,
                            "created_at": "2022-11-02T06:52:36.170Z",
                            "updated_at": "2022-11-02T06:52:36.170Z"
                        },
                        {
                            "id": 107,
                            "answer": "Thrice a week",
                            "score": "2",
                            "question_well_being_id": 24,
                            "created_at": "2022-11-02T06:52:36.172Z",
                            "updated_at": "2022-11-02T06:52:36.172Z"
                        },
                        {
                            "id": 108,
                            "answer": "More than thrice a week",
                            "score": "3",
                            "question_well_being_id": 24,
                            "created_at": "2022-11-02T06:52:36.175Z",
                            "updated_at": "2022-11-02T06:52:36.175Z"
                        }
                    ]
                }
            }
        },
        {
            "id": "25",
            "type": "question",
            "attributes": {
                "question_answers": {
                    "question": {
                        "id": 25,
                        "question": "What do you think is your level of control in being able to stop using cigarettes or alcohol when you want to?",
                        "category_id": 1,
                        "subcategory_id": 9,
                        "created_at": "2022-11-02T06:53:36.901Z",
                        "updated_at": "2022-11-02T06:53:36.901Z"
                    },
                    "answers": [
                        {
                            "id": 109,
                            "answer": "Very much in control",
                            "score": "0",
                            "question_well_being_id": 25,
                            "created_at": "2022-11-02T06:53:36.905Z",
                            "updated_at": "2022-11-02T06:53:36.905Z"
                        },
                        {
                            "id": 110,
                            "answer": "Almost in control",
                            "score": "1",
                            "question_well_being_id": 25,
                            "created_at": "2022-11-02T06:53:36.908Z",
                            "updated_at": "2022-11-02T06:53:36.908Z"
                        },
                        {
                            "id": 111,
                            "answer": "Less in control",
                            "score": "2",
                            "question_well_being_id": 25,
                            "created_at": "2022-11-02T06:53:36.909Z",
                            "updated_at": "2022-11-02T06:53:36.909Z"
                        },
                        {
                            "id": 112,
                            "answer": "Not at all in control",
                            "score": "3",
                            "question_well_being_id": 25,
                            "created_at": "2022-11-02T06:53:36.911Z",
                            "updated_at": "2022-11-02T06:53:36.911Z"
                        }
                    ]
                }
            }
        },
        {
            "id": "16",
            "type": "question",
            "attributes": {
                "question_answers": {
                    "question": {
                        "id": 16,
                        "question": " Have you been feeling reasonably happy, all things considered in the past few weeks?",
                        "category_id": 1,
                        "subcategory_id": null,
                        "created_at": "2022-11-02T06:41:06.463Z",
                        "updated_at": "2022-11-09T12:29:31.202Z"
                    },
                    "answers": [
                        {
                            "id": 70,
                            "answer": "much less than usual ",
                            "score": "0",
                            "question_well_being_id": 16,
                            "created_at": "2022-11-02T06:41:06.472Z",
                            "updated_at": "2022-11-14T09:55:42.607Z"
                        },
                        {
                            "id": 67,
                            "answer": "more so than usual ",
                            "score": "3",
                            "question_well_being_id": 16,
                            "created_at": "2022-11-02T06:41:06.466Z",
                            "updated_at": "2022-11-14T09:55:42.608Z"
                        },
                        {
                            "id": 68,
                            "answer": "same as usual ",
                            "score": "2",
                            "question_well_being_id": 16,
                            "created_at": "2022-11-02T06:41:06.467Z",
                            "updated_at": "2022-11-14T09:55:42.609Z"
                        },
                        {
                            "id": 69,
                            "answer": "less so than usual ",
                            "score": "1",
                            "question_well_being_id": 16,
                            "created_at": "2022-11-02T06:41:06.470Z",
                            "updated_at": "2022-11-14T09:55:42.610Z"
                        }
                    ]
                }
            }
        },
        {
            "id": "15",
            "type": "question",
            "attributes": {
                "question_answers": {
                    "question": {
                        "id": 15,
                        "question": "Have you been thinking of yourself as a worthless person in the past few weeks?",
                        "category_id": 1,
                        "subcategory_id": null,
                        "created_at": "2022-11-02T06:40:21.534Z",
                        "updated_at": "2022-11-10T11:05:33.458Z"
                    },
                    "answers": [
                        {
                            "id": 66,
                            "answer": "much more than usual",
                            "score": "0",
                            "question_well_being_id": 15,
                            "created_at": "2022-11-02T06:40:21.543Z",
                            "updated_at": "2022-11-14T09:57:00.133Z"
                        },
                        {
                            "id": 63,
                            "answer": "not at all ",
                            "score": "3",
                            "question_well_being_id": 15,
                            "created_at": "2022-11-02T06:40:21.537Z",
                            "updated_at": "2022-11-14T09:57:00.134Z"
                        },
                        {
                            "id": 64,
                            "answer": "no more than usual ",
                            "score": "2",
                            "question_well_being_id": 15,
                            "created_at": "2022-11-02T06:40:21.540Z",
                            "updated_at": "2022-11-14T09:57:00.135Z"
                        },
                        {
                            "id": 65,
                            "answer": "rather more than usual ",
                            "score": "1",
                            "question_well_being_id": 15,
                            "created_at": "2022-11-02T06:40:21.541Z",
                            "updated_at": "2022-11-14T09:57:00.136Z"
                        }
                    ]
                }
            }
        },
        {
            "id": "14",
            "type": "question",
            "attributes": {
                "question_answers": {
                    "question": {
                        "id": 14,
                        "question": "Have you been losing confidence in yourself in the past few weeks? ",
                        "category_id": 1,
                        "subcategory_id": null,
                        "created_at": "2022-11-02T06:39:40.342Z",
                        "updated_at": "2022-11-10T11:06:00.297Z"
                    },
                    "answers": [
                        {
                            "id": 62,
                            "answer": "much more than usual ",
                            "score": "0",
                            "question_well_being_id": 14,
                            "created_at": "2022-11-02T06:39:40.355Z",
                            "updated_at": "2022-11-14T09:58:28.932Z"
                        },
                        {
                            "id": 59,
                            "answer": "not at all ",
                            "score": "3",
                            "question_well_being_id": 14,
                            "created_at": "2022-11-02T06:39:40.347Z",
                            "updated_at": "2022-11-14T09:58:28.936Z"
                        },
                        {
                            "id": 60,
                            "answer": "no more than usual ",
                            "score": "2",
                            "question_well_being_id": 14,
                            "created_at": "2022-11-02T06:39:40.349Z",
                            "updated_at": "2022-11-14T09:58:28.938Z"
                        },
                        {
                            "id": 61,
                            "answer": "rather more than usual ",
                            "score": "1",
                            "question_well_being_id": 14,
                            "created_at": "2022-11-02T06:39:40.352Z",
                            "updated_at": "2022-11-14T09:58:28.940Z"
                        }
                    ]
                }
            }
        },
        {
            "id": "13",
            "type": "question",
            "attributes": {
                "question_answers": {
                    "question": {
                        "id": 13,
                        "question": "Have you been feeling unhappy or depressed in the past few weeks ",
                        "category_id": 1,
                        "subcategory_id": null,
                        "created_at": "2022-11-02T06:37:28.765Z",
                        "updated_at": "2022-11-10T11:07:14.395Z"
                    },
                    "answers": [
                        {
                            "id": 58,
                            "answer": "much more than usual",
                            "score": "0",
                            "question_well_being_id": 13,
                            "created_at": "2022-11-02T06:37:28.776Z",
                            "updated_at": "2022-11-14T09:59:34.013Z"
                        },
                        {
                            "id": 55,
                            "answer": "not at all ",
                            "score": "3",
                            "question_well_being_id": 13,
                            "created_at": "2022-11-02T06:37:28.769Z",
                            "updated_at": "2022-11-14T09:59:34.023Z"
                        },
                        {
                            "id": 56,
                            "answer": "no more than usual ",
                            "score": "2",
                            "question_well_being_id": 13,
                            "created_at": "2022-11-02T06:37:28.772Z",
                            "updated_at": "2022-11-14T09:59:34.024Z"
                        },
                        {
                            "id": 57,
                            "answer": "rather more than usual ",
                            "score": "1",
                            "question_well_being_id": 13,
                            "created_at": "2022-11-02T06:37:28.774Z",
                            "updated_at": "2022-11-14T09:59:34.025Z"
                        }
                    ]
                }
            }
        },
        {
            "id": "12",
            "type": "question",
            "attributes": {
                "question_answers": {
                    "question": {
                        "id": 12,
                        "question": "Have you been able to face up to your problems in the past few weeks?",
                        "category_id": 1,
                        "subcategory_id": null,
                        "created_at": "2022-11-02T06:35:53.318Z",
                        "updated_at": "2022-11-10T11:07:40.260Z"
                    },
                    "answers": [
                        {
                            "id": 54,
                            "answer": "much less than usual ",
                            "score": "0",
                            "question_well_being_id": 12,
                            "created_at": "2022-11-02T06:35:53.327Z",
                            "updated_at": "2022-11-14T10:00:29.562Z"
                        },
                        {
                            "id": 51,
                            "answer": " more so than usual ",
                            "score": "3",
                            "question_well_being_id": 12,
                            "created_at": "2022-11-02T06:35:53.322Z",
                            "updated_at": "2022-11-14T10:00:29.566Z"
                        },
                        {
                            "id": 52,
                            "answer": "same as usual ",
                            "score": "2",
                            "question_well_being_id": 12,
                            "created_at": "2022-11-02T06:35:53.324Z",
                            "updated_at": "2022-11-14T10:00:29.569Z"
                        },
                        {
                            "id": 53,
                            "answer": "less so than usual ",
                            "score": "1",
                            "question_well_being_id": 12,
                            "created_at": "2022-11-02T06:35:53.325Z",
                            "updated_at": "2022-11-14T10:00:29.571Z"
                        }
                    ]
                }
            }
        },
        {
            "id": "11",
            "type": "question",
            "attributes": {
                "question_answers": {
                    "question": {
                        "id": 11,
                        "question": "Have you been able to enjoy your normal day to day activities in the past few weeks? ",
                        "category_id": 1,
                        "subcategory_id": null,
                        "created_at": "2022-11-02T06:34:35.540Z",
                        "updated_at": "2022-11-10T11:08:16.169Z"
                    },
                    "answers": [
                        {
                            "id": 50,
                            "answer": "much less than usual ",
                            "score": "0",
                            "question_well_being_id": 11,
                            "created_at": "2022-11-02T06:34:35.548Z",
                            "updated_at": "2022-11-14T10:01:12.475Z"
                        },
                        {
                            "id": 47,
                            "answer": "more so than usual ",
                            "score": "3",
                            "question_well_being_id": 11,
                            "created_at": "2022-11-02T06:34:35.543Z",
                            "updated_at": "2022-11-14T10:01:12.483Z"
                        },
                        {
                            "id": 48,
                            "answer": "same as usual ",
                            "score": "2",
                            "question_well_being_id": 11,
                            "created_at": "2022-11-02T06:34:35.545Z",
                            "updated_at": "2022-11-14T10:01:12.485Z"
                        },
                        {
                            "id": 49,
                            "answer": "less so than usual ",
                            "score": "1",
                            "question_well_being_id": 11,
                            "created_at": "2022-11-02T06:34:35.547Z",
                            "updated_at": "2022-11-14T10:01:12.487Z"
                        }
                    ]
                }
            }
        },
        {
            "id": "10",
            "type": "question",
            "attributes": {
                "question_answers": {
                    "question": {
                        "id": 10,
                        "question": "Have you felt you couldn't overcome your difficulties in the past few weeks?",
                        "category_id": 1,
                        "subcategory_id": null,
                        "created_at": "2022-11-02T06:33:37.396Z",
                        "updated_at": "2022-11-10T11:10:38.958Z"
                    },
                    "answers": [
                        {
                            "id": 43,
                            "answer": "not at all ",
                            "score": "3",
                            "question_well_being_id": 10,
                            "created_at": "2022-11-02T06:33:37.400Z",
                            "updated_at": "2022-11-14T10:02:18.875Z"
                        },
                        {
                            "id": 44,
                            "answer": "no more than usual ",
                            "score": "2",
                            "question_well_being_id": 10,
                            "created_at": "2022-11-02T06:33:37.402Z",
                            "updated_at": "2022-11-14T10:02:18.876Z"
                        },
                        {
                            "id": 45,
                            "answer": " rather more than usual ",
                            "score": "1",
                            "question_well_being_id": 10,
                            "created_at": "2022-11-02T06:33:37.404Z",
                            "updated_at": "2022-11-14T10:02:18.877Z"
                        },
                        {
                            "id": 46,
                            "answer": "much more than usual ",
                            "score": "0",
                            "question_well_being_id": 10,
                            "created_at": "2022-11-02T06:33:37.406Z",
                            "updated_at": "2022-11-14T10:02:18.878Z"
                        }
                    ]
                }
            }
        },
        {
            "id": "9",
            "type": "question",
            "attributes": {
                "question_answers": {
                    "question": {
                        "id": 9,
                        "question": "Have you felt constantly under strain in the past few weeks?",
                        "category_id": 1,
                        "subcategory_id": null,
                        "created_at": "2022-11-02T06:29:50.089Z",
                        "updated_at": "2022-11-10T11:11:05.752Z"
                    },
                    "answers": [
                        {
                            "id": 42,
                            "answer": "much more than usual ",
                            "score": "0",
                            "question_well_being_id": 9,
                            "created_at": "2022-11-02T06:29:50.101Z",
                            "updated_at": "2022-11-14T10:02:58.635Z"
                        },
                        {
                            "id": 39,
                            "answer": "not at all ",
                            "score": "3",
                            "question_well_being_id": 9,
                            "created_at": "2022-11-02T06:29:50.094Z",
                            "updated_at": "2022-11-14T10:02:58.636Z"
                        },
                        {
                            "id": 40,
                            "answer": "no more than usual ",
                            "score": "2",
                            "question_well_being_id": 9,
                            "created_at": "2022-11-02T06:29:50.096Z",
                            "updated_at": "2022-11-14T10:02:58.637Z"
                        },
                        {
                            "id": 41,
                            "answer": "rather more than usual ",
                            "score": "1",
                            "question_well_being_id": 9,
                            "created_at": "2022-11-02T06:29:50.099Z",
                            "updated_at": "2022-11-14T10:02:58.638Z"
                        }
                    ]
                }
            }
        },
        {
            "id": "8",
            "type": "question",
            "attributes": {
                "question_answers": {
                    "question": {
                        "id": 8,
                        "question": "Have you felt capable of making decisions about things in the past few weeks ?",
                        "category_id": 1,
                        "subcategory_id": null,
                        "created_at": "2022-11-02T06:28:24.410Z",
                        "updated_at": "2022-11-10T11:11:24.571Z"
                    },
                    "answers": [
                        {
                            "id": 38,
                            "answer": "much less than usual ",
                            "score": "0",
                            "question_well_being_id": 8,
                            "created_at": "2022-11-02T06:28:24.421Z",
                            "updated_at": "2022-11-14T10:03:38.031Z"
                        },
                        {
                            "id": 35,
                            "answer": "more so than usual ",
                            "score": "3",
                            "question_well_being_id": 8,
                            "created_at": "2022-11-02T06:28:24.414Z",
                            "updated_at": "2022-11-14T10:03:38.034Z"
                        },
                        {
                            "id": 36,
                            "answer": "same as usual ",
                            "score": "2",
                            "question_well_being_id": 8,
                            "created_at": "2022-11-02T06:28:24.417Z",
                            "updated_at": "2022-11-14T10:03:38.036Z"
                        },
                        {
                            "id": 37,
                            "answer": "less so than usual ",
                            "score": "1",
                            "question_well_being_id": 8,
                            "created_at": "2022-11-02T06:28:24.419Z",
                            "updated_at": "2022-11-14T10:03:38.038Z"
                        }
                    ]
                }
            }
        },
        {
            "id": "7",
            "type": "question",
            "attributes": {
                "question_answers": {
                    "question": {
                        "id": 7,
                        "question": "Have you felt that you are playing a useful part in things in the past few weeks ? ",
                        "category_id": 1,
                        "subcategory_id": null,
                        "created_at": "2022-11-02T06:27:23.638Z",
                        "updated_at": "2022-11-10T11:11:46.021Z"
                    },
                    "answers": [
                        {
                            "id": 34,
                            "answer": "much less than usual ",
                            "score": "0",
                            "question_well_being_id": 7,
                            "created_at": "2022-11-02T06:27:23.650Z",
                            "updated_at": "2022-11-14T10:04:43.898Z"
                        },
                        {
                            "id": 31,
                            "answer": "more so than usual ",
                            "score": "3",
                            "question_well_being_id": 7,
                            "created_at": "2022-11-02T06:27:23.643Z",
                            "updated_at": "2022-11-14T10:04:43.901Z"
                        },
                        {
                            "id": 32,
                            "answer": "same as usual ",
                            "score": "2",
                            "question_well_being_id": 7,
                            "created_at": "2022-11-02T06:27:23.646Z",
                            "updated_at": "2022-11-14T10:04:43.903Z"
                        },
                        {
                            "id": 33,
                            "answer": "less so than usual ",
                            "score": "1",
                            "question_well_being_id": 7,
                            "created_at": "2022-11-02T06:27:23.648Z",
                            "updated_at": "2022-11-14T10:04:43.905Z"
                        }
                    ]
                }
            }
        },
        {
            "id": "2",
            "type": "question",
            "attributes": {
                "question_answers": {
                    "question": {
                        "id": 2,
                        "question": "Have you lost much sleep over worry in the past few weeks?",
                        "category_id": 1,
                        "subcategory_id": null,
                        "created_at": "2022-10-31T04:38:58.527Z",
                        "updated_at": "2022-11-10T11:12:10.334Z"
                    },
                    "answers": [
                        {
                            "id": 8,
                            "answer": "much more than usual ",
                            "score": "0",
                            "question_well_being_id": 2,
                            "created_at": "2022-10-31T04:38:58.540Z",
                            "updated_at": "2022-11-14T10:05:59.107Z"
                        },
                        {
                            "id": 5,
                            "answer": "not at all ",
                            "score": "3",
                            "question_well_being_id": 2,
                            "created_at": "2022-10-31T04:38:58.532Z",
                            "updated_at": "2022-11-14T10:05:59.109Z"
                        },
                        {
                            "id": 6,
                            "answer": "no more than usual ",
                            "score": "2",
                            "question_well_being_id": 2,
                            "created_at": "2022-10-31T04:38:58.534Z",
                            "updated_at": "2022-11-14T10:05:59.112Z"
                        },
                        {
                            "id": 7,
                            "answer": "rather more than usual ",
                            "score": "1",
                            "question_well_being_id": 2,
                            "created_at": "2022-10-31T04:38:58.537Z",
                            "updated_at": "2022-11-14T10:05:59.114Z"
                        }
                    ]
                }
            }
        }
    ]
}
const feature = loadFeature('./__tests__/features/WellBeingAssTest-scenario.feature');

defineFeature(feature, (test) => {


    beforeEach(() => {
        jest.resetModules();
        jest.doMock('react-native', () => ({ Platform: { OS: 'web' }}));
        jest.spyOn(helpers, 'getOS').mockImplementation(() => 'web');
    });

    test('User navigates to WellBeingAssTest', ({ given, when, then }) => {
        let exampleBlockA:ShallowWrapper;
        let instance:WellBeingAssTest; 
      

        given('I am a User loading WellBeingAssTest', () => {
            exampleBlockA = shallow(<WellBeingAssTest {...screenProps}/>);
            expect(exampleBlockA).toBeTruthy()
            instance = exampleBlockA.instance() as WellBeingAssTest
    
        });

        when('I navigate to the WellBeingAssTest', () => {
             instance = exampleBlockA.instance() as WellBeingAssTest
             instance.componentDidMount();
             
        });

        then('WellBeingAssTest will load with out errors', () => {
            expect(exampleBlockA).toBeTruthy();
            instance.setState({qtnIndex:1 ,loading: false ,selectedCatId:1,token:"eyJhbGciOiJIUzUxMiJ9.eyJpZCI6MTkyLCJleHAiOjE2NzIyMjY2ODUsInRva2VuX3R5cGUiOiJsb2dpbiJ9.PY-GehPKm5dK90iVZTxTZBge_U41ctkc6QMFcPBc3HT7gQxwY_rsxt09qoOjCWf5CXwylQ8XV26w1FmMBcyUYA" });
            let btnTouchableKeyboardhide = exampleBlockA.findWhere((node) => node.prop('testID') === 'touchableKeyboard');
            btnTouchableKeyboardhide.simulate('press');

        });
        then('Network response for get all requests',()=>{
            const msg = new Message(
                getName(MessageEnum.RestAPIResponceMessage)
              );
        
              msg.addData(
                getName(MessageEnum.RestAPIResponceDataMessage),
                msg.messageId
              )
        
              msg.addData(
                getName(MessageEnum.RestAPIResponceSuccessMessage),
                qtnData
              )
              instance.getQuestionsApiCallId = msg.messageId
              runEngine.sendMessage('From unit test', msg);
        });
        then('Network error response for get all requests',()=>{
            const msg = new Message(
                getName(MessageEnum.RestAPIResponceMessage)
              );
        
              msg.addData(
                getName(MessageEnum.RestAPIResponceDataMessage),
                msg.messageId
              )
        
              msg.addData(
                getName(MessageEnum.RestAPIResponceErrorMessage),
                "Something went wrong. Please try again"
              )
              instance.getQuestionsApiCallId = msg.messageId
              runEngine.sendMessage('From unit test', msg);
        });
        then('Network responseJson message error response for get all requests',()=>{
            const msg = new Message(
                getName(MessageEnum.RestAPIResponceMessage)
              );
        
              msg.addData(
                getName(MessageEnum.RestAPIResponceDataMessage),
                msg.messageId
              )
        
              msg.addData(
                getName(MessageEnum.RestAPIResponceSuccessMessage),
                {message:"Something went wrong. Please try again"}
              )
              instance.getQuestionsApiCallId = msg.messageId
              runEngine.sendMessage('From unit test', msg);
        });
        then('I can select Answer choice with out error',()=>{

            let fquestion = qtnData?.data[0];
           
          instance.setState({question_id: fquestion?.attributes?.question_answers?.question?.id,selectedQue:fquestion, questionResponse: qtnData?.data},()=>{
            console.log("Selected>>",fquestion);
          })
          instance.renderAnswerOptions(fquestion?.attributes?.question_answers?.answers, fquestion?.attributes?.question_answers?.question?.id)
            let btnAnsChoice = exampleBlockA.findWhere((node) => node.prop('testID') === 'ansChoice0');
            btnAnsChoice.simulate('press');
            let btnNext = exampleBlockA.findWhere((node) => node.prop('testID') === 'btnNext');
            btnNext.simulate('press');
            instance.getQuestions();
            instance.ansFirstQuestion({
                "question_id":25,
                "answer_id":109
            });
            const msg = new Message(
                getName(MessageEnum.RestAPIResponceMessage)
              );
        
              msg.addData(
                getName(MessageEnum.RestAPIResponceDataMessage),
                msg.messageId
              )
        
              msg.addData(
                getName(MessageEnum.RestAPIResponceSuccessMessage),
                {
                    "useranswer": {
                        "id": 36,
                        "answer_id": 109,
                        "question_id": 25,
                        "account_id": 150,
                        "created_at": "2022-11-02T10:25:41.059Z",
                        "updated_at": "2022-12-06T05:06:40.818Z"
                    },
                    "last_question": false
                }
              )
              instance.ansFirstQuestionApiCallId = msg.messageId
              runEngine.sendMessage('From unit test', msg);
        });
        then('I can leave the screen with out errors', () => {
            instance.componentWillUnmount()
            expect(exampleBlockA).toBeTruthy();
        });
    });


});
