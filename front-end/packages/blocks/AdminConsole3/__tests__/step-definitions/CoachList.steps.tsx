// @ts-nocheck
import { defineFeature, loadFeature} from "jest-cucumber"
import { shallow, ShallowWrapper } from 'enzyme'

import * as helpers from '../../../../framework/src/Helpers'
import {runEngine} from '../../../../framework/src/RunEngine'
import {Message} from "../../../../framework/src/Message"

import MessageEnum, {getName} from "../../../../framework/src/Messages/MessageEnum"; 
import React from "react";


import CoachList from "../../src/CoachList"
const navigation = require("react-navigation");
import { fireEvent,render,screen
 } from "@testing-library/react-native"

const screenProps = {
    navigation: {
        navigate:jest.fn(),
        goBack:jest.fn()
       
    },
    id: "AddNewCom"
  }
  jest.useFakeTimers();
  
  const companyData={
    "data": [
        {
            "id": "11",
            "type": "company",
            "attributes": {
                "id": 11,
                "name": "techno",
                "email": "techno@gmail.com",
                "address": "pune ",
                "hr_code": "kQX2Sz",
                "employee_code": "q1MZNWN",
                "company_date": "2022-11-04",
                "company_image": null
            }
        },
        {
            "id": "13",
            "type": "company",
            "attributes": {
                "id": 13,
                "name": "Nov comp",
                "email": "test123@gmail.com",
                "address": "test",
                "hr_code": "juglVJ",
                "employee_code": "Ch7V40N",
                "company_date": "2022-11-07",
                "company_image": null
            }
        },
        {
            "id": "4",
            "type": "company",
            "attributes": {
                "id": 4,
                "name": "Builder",
                "email": "builderedit@gmail.com",
                "address": "Delhi NCR",
                "hr_code": "pBMc1E",
                "employee_code": "DZZHzv8",
                "company_date": "2022-10-13",
                "company_image": null
            }
        },
        {
            "id": "15",
            "type": "company",
            "attributes": {
                "id": 15,
                "name": "Digi Sol",
                "email": "diginewcom@gmail.com",
                "address": "mumbai",
                "hr_code": "6FEIRD",
                "employee_code": "Fg76Rcm",
                "company_date": "2022-11-16",
                "company_image": null
            }
        },
        {
            "id": "6",
            "type": "company",
            "attributes": {
                "id": 6,
                "name": "Builder.AI",
                "email": "Buildereditied@builder.ai",
                "address": "Pune",
                "hr_code": "H1jJda",
                "employee_code": "TODoLce",
                "company_date": "2022-10-18",
                "company_image": null
            }
        },
        {
            "id": "17",
            "type": "company",
            "attributes": {
                "id": 17,
                "name": "Verizon",
                "email": "verizon@gmail.com",
                "address": "Verizon,USA, ",
                "hr_code": "ulBc1M",
                "employee_code": "bL93fpX",
                "company_date": "2022-11-17",
                "company_image": null
            }
        },
        {
            "id": "3",
            "type": "company",
            "attributes": {
                "id": 3,
                "name": "TCS",
                "email": "tcs@gmail.com",
                "address": "Pune ",
                "hr_code": "ZEAijE",
                "employee_code": "dsMyzfJ",
                "company_date": "2022-10-13",
                "company_image": null
            }
        },
        {
            "id": "14",
            "type": "company",
            "attributes": {
                "id": 14,
                "name": "DivyaPrakash Comapny",
                "email": "divya@gmail.com",
                "address": "Chennai",
                "hr_code": "HDnrS3",
                "employee_code": "64PLs8M",
                "company_date": "2022-11-09",
                "company_image": null
            }
        },
        {
            "id": "7",
            "type": "company",
            "attributes": {
                "id": 7,
                "name": "info",
                "email": "info@gmail.com",
                "address": "pune",
                "hr_code": "7GDpwL",
                "employee_code": "X8ixDVx",
                "company_date": "2022-10-26",
                "company_image": null
            }
        },
        {
            "id": "19",
            "type": "company",
            "attributes": {
                "id": 19,
                "name": "Apple Company ",
                "email": "apple@gmail.com",
                "address": "Apple, Washington DC ",
                "hr_code": "rdBFTK",
                "employee_code": "PQQNpNF",
                "company_date": "2022-11-24",
                "company_image": null
            }
        },
        {
            "id": "20",
            "type": "company",
            "attributes": {
                "id": 20,
                "name": "Jio",
                "email": "Jio@gmail.com",
                "address": "Navi,Mumbai",
                "hr_code": "KwqNQY",
                "employee_code": "yfWeCWk",
                "company_date": "2022-12-06",
                "company_image": null
            }
        },
        {
            "id": "21",
            "type": "company",
            "attributes": {
                "id": 21,
                "name": "Mindera",
                "email": "nidhil@niya.app",
                "address": "chennai",
                "hr_code": "RBqGTP",
                "employee_code": "7lKSvTH",
                "company_date": "2022-12-07",
                "company_image": null
            }
        },
        {
            "id": "22",
            "type": "company",
            "attributes": {
                "id": 22,
                "name": "Dominos",
                "email": "dominos@gmail.com",
                "address": "Chennai,India",
                "hr_code": "hgMue9",
                "employee_code": "ZcBHSkC",
                "company_date": "2022-12-08",
                "company_image": null
            }
        },
        {
            "id": "8",
            "type": "company",
            "attributes": {
                "id": 8,
                "name": "Test comp",
                "email": "testnew@gmail.com",
                "address": "pune",
                "hr_code": "zP2mgM",
                "employee_code": "THEo7Re",
                "company_date": "2022-11-04",
                "company_image": null
            }
        },
        {
            "id": "9",
            "type": "company",
            "attributes": {
                "id": 9,
                "name": "Test tch comp",
                "email": "test@gmail.com",
                "address": "test",
                "hr_code": "DS02br",
                "employee_code": "XT5I9mP",
                "company_date": "2022-11-04",
                "company_image": null
            }
        },
        {
            "id": "12",
            "type": "company",
            "attributes": {
                "id": 12,
                "name": "tech world edit",
                "email": "techworld@gmail.com",
                "address": "punec",
                "hr_code": "W6oF8b",
                "employee_code": "gapV22l",
                "company_date": "2022-11-04",
                "company_image": null
            }
        },
        {
            "id": "23",
            "type": "company",
            "attributes": {
                "id": 23,
                "name": "Test",
                "email": "test@gmail.com",
                "address": "test",
                "hr_code": "0jW1Lq",
                "employee_code": "482Xzet",
                "company_date": "2022-12-22",
                "company_image": null
            }
        },
        {
            "id": "24",
            "type": "company",
            "attributes": {
                "id": 24,
                "name": "sonali techhub",
                "email": "sonali.tech@gmail.com",
                "address": "pune ",
                "hr_code": "h9r0G5",
                "employee_code": "RZYwRna",
                "company_date": "2022-12-22",
                "company_image": null
            }
        },
        {
            "id": "10",
            "type": "company",
            "attributes": {
                "id": 10,
                "name": "infosys techno hub",
                "email": "infosys@gmail.com",
                "address": "bang",
                "hr_code": "Bs0uUy",
                "employee_code": "83lyj8m",
                "company_date": "2022-11-04",
                "company_image": null
            }
        },
        {
            "id": "25",
            "type": "company",
            "attributes": {
                "id": 25,
                "name": "Test",
                "email": "test@gmail.com",
                "address": "test",
                "hr_code": "nkBQ4f",
                "employee_code": "Z44Jg0j",
                "company_date": "2022-12-30",
                "company_image": null
            }
        },
        {
            "id": "26",
            "type": "company",
            "attributes": {
                "id": 26,
                "name": "Test",
                "email": "test@gmail.com",
                "address": "test",
                "hr_code": "Cuad6M",
                "employee_code": "HqERhM7",
                "company_date": "2023-01-03",
                "company_image": null
            }
        }
    ]
}

const userGroupsdata={
    "data": [
        {
            "id": "372",
            "type": "employee_detail",
            "attributes": {
                "employee_details": {
                    "id": 372,
                    "full_name": "sms user ",
                    "enrolled": "2022-12-30",
                    "code": "PQQNpNF",
                    "image": null
                }
            }
        },
        {
            "id": "371",
            "type": "employee_detail",
            "attributes": {
                "employee_details": {
                    "id": 371,
                    "full_name": " ",
                    "enrolled": "2022-12-30",
                    "code": "dsMyzfJ",
                    "image": null
                }
            }
        },
        {
            "id": "369",
            "type": "employee_detail",
            "attributes": {
                "employee_details": {
                    "id": 369,
                    "full_name": "Madhan",
                    "enrolled": "2022-12-27",
                    "code": "ZcBHSkC",
                    "image": null
                }
            }
        },
        {
            "id": "359",
            "type": "employee_detail",
            "attributes": {
                "employee_details": {
                    "id": 359,
                    "full_name": "DEmployee7",
                    "enrolled": "2022-12-18",
                    "code": "ZcBHSkC",
                    "image": null
                }
            }
        },
        {
            "id": "358",
            "type": "employee_detail",
            "attributes": {
                "employee_details": {
                    "id": 358,
                    "full_name": "wellbeing test",
                    "enrolled": "2022-12-16",
                    "code": "DZZHzv8",
                    "image": null
                }
            }
        },
        {
            "id": "357",
            "type": "employee_detail",
            "attributes": {
                "employee_details": {
                    "id": 357,
                    "full_name": "well3",
                    "enrolled": "2022-12-16",
                    "code": "DZZHzv8",
                    "image": null
                }
            }
        },
        {
            "id": "356",
            "type": "employee_detail",
            "attributes": {
                "employee_details": {
                    "id": 356,
                    "full_name": "well2",
                    "enrolled": "2022-12-16",
                    "code": "DZZHzv8",
                    "image": null
                }
            }
        },
        {
            "id": "355",
            "type": "employee_detail",
            "attributes": {
                "employee_details": {
                    "id": 355,
                    "full_name": "wee 1",
                    "enrolled": "2022-12-16",
                    "code": "DZZHzv8",
                    "image": null
                }
            }
        },
        {
            "id": "354",
            "type": "employee_detail",
            "attributes": {
                "employee_details": {
                    "id": 354,
                    "full_name": "well test user",
                    "enrolled": "2022-12-16",
                    "code": "DZZHzv8",
                    "image": null
                }
            }
        },
        {
            "id": "353",
            "type": "employee_detail",
            "attributes": {
                "employee_details": {
                    "id": 353,
                    "full_name": "weell-being test new user",
                    "enrolled": "2022-12-16",
                    "code": "DZZHzv8",
                    "image": null
                }
            }
        },
        {
            "id": "352",
            "type": "employee_detail",
            "attributes": {
                "employee_details": {
                    "id": 352,
                    "full_name": "Hello",
                    "enrolled": "2022-12-15",
                    "code": "dsMyzfJ",
                    "image": null
                }
            }
        },
        {
            "id": "351",
            "type": "employee_detail",
            "attributes": {
                "employee_details": {
                    "id": 351,
                    "full_name": "Test",
                    "enrolled": "2022-12-13",
                    "code": "yfWeCWk",
                    "image": null
                }
            }
        },
        {
            "id": "349",
            "type": "employee_detail",
            "attributes": {
                "employee_details": {
                    "id": 349,
                    "full_name": "DEmployee6 ",
                    "enrolled": "2022-12-13",
                    "code": "ZcBHSkC",
                    "image": null
                }
            }
        },
        {
            "id": "343",
            "type": "employee_detail",
            "attributes": {
                "employee_details": {
                    "id": 343,
                    "full_name": "dom emp",
                    "enrolled": "2022-12-12",
                    "code": "ZcBHSkC",
                    "image": null
                }
            }
        },
        {
            "id": "333",
            "type": "employee_detail",
            "attributes": {
                "employee_details": {
                    "id": 333,
                    "full_name": "DEmployee4",
                    "enrolled": "2022-12-12",
                    "code": "ZcBHSkC",
                    "image": null
                }
            }
        },
        {
            "id": "325",
            "type": "employee_detail",
            "attributes": {
                "employee_details": {
                    "id": 325,
                    "full_name": "Swamy",
                    "enrolled": "2022-12-09",
                    "code": "yfWeCWk",
                    "image": null
                }
            }
        },
        {
            "id": "323",
            "type": "employee_detail",
            "attributes": {
                "employee_details": {
                    "id": 323,
                    "full_name": "Ramesh",
                    "enrolled": "2022-12-09",
                    "code": "yfWeCWk",
                    "image": null
                }
            }
        },
        {
            "id": "321",
            "type": "employee_detail",
            "attributes": {
                "employee_details": {
                    "id": 321,
                    "full_name": "DEmployee1",
                    "enrolled": "2022-12-09",
                    "code": "ZcBHSkC",
                    "image": null
                }
            }
        },
        {
            "id": "319",
            "type": "employee_detail",
            "attributes": {
                "employee_details": {
                    "id": 319,
                    "full_name": " user1111",
                    "enrolled": "2022-12-08",
                    "code": "dsMyzfJ",
                    "image": null
                }
            }
        },
        {
            "id": "318",
            "type": "employee_detail",
            "attributes": {
                "employee_details": {
                    "id": 318,
                    "full_name": "DEmployee",
                    "enrolled": "2022-12-08",
                    "code": "ZcBHSkC",
                    "image": "https://niya-178517-ruby.b178517.dev.eastus.az.svc.builder.cafe/rails/active_storage/blobs/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBYUE9IiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--a6c3566fe15d4b7e931e914a8f0ab5c8113be5e5/profile.jpg"
                }
            }
        },
        {
            "id": "316",
            "type": "employee_detail",
            "attributes": {
                "employee_details": {
                    "id": 316,
                    "full_name": "test user",
                    "enrolled": "2022-12-08",
                    "code": "dsMyzfJ",
                    "image": null
                }
            }
        },
        {
            "id": "307",
            "type": "employee_detail",
            "attributes": {
                "employee_details": {
                    "id": 307,
                    "full_name": "fcm ",
                    "enrolled": "2022-12-07",
                    "code": "PQQNpNF",
                    "image": null
                }
            }
        },
        {
            "id": "305",
            "type": "employee_detail",
            "attributes": {
                "employee_details": {
                    "id": 305,
                    "full_name": "Harake Sonali",
                    "enrolled": "2022-12-07",
                    "code": "PQQNpNF",
                    "image": null
                }
            }
        },
        {
            "id": "304",
            "type": "employee_detail",
            "attributes": {
                "employee_details": {
                    "id": 304,
                    "full_name": "Ajith",
                    "enrolled": "2022-12-06",
                    "code": "yfWeCWk",
                    "image": null
                }
            }
        },
        {
            "id": "298",
            "type": "employee_detail",
            "attributes": {
                "employee_details": {
                    "id": 298,
                    "full_name": "sonlazi",
                    "enrolled": "2022-12-02",
                    "code": "PQQNpNF",
                    "image": null
                }
            }
        },
        {
            "id": "297",
            "type": "employee_detail",
            "attributes": {
                "employee_details": {
                    "id": 297,
                    "full_name": "ABC",
                    "enrolled": "2022-12-01",
                    "code": "PQQNpNF",
                    "image": null
                }
            }
        },
        {
            "id": "295",
            "type": "employee_detail",
            "attributes": {
                "employee_details": {
                    "id": 295,
                    "full_name": "sonali assess",
                    "enrolled": "2022-11-30",
                    "code": "TODoLce",
                    "image": null
                }
            }
        },
        {
            "id": "294",
            "type": "employee_detail",
            "attributes": {
                "employee_details": {
                    "id": 294,
                    "full_name": "assess user",
                    "enrolled": "2022-11-30",
                    "code": "X8ixDVx",
                    "image": null
                }
            }
        },
        {
            "id": "293",
            "type": "employee_detail",
            "attributes": {
                "employee_details": {
                    "id": 293,
                    "full_name": "Au",
                    "enrolled": "2022-11-30",
                    "code": "PQQNpNF",
                    "image": null
                }
            }
        },
        {
            "id": "291",
            "type": "employee_detail",
            "attributes": {
                "employee_details": {
                    "id": 291,
                    "full_name": "sonali assess testing",
                    "enrolled": "2022-11-29",
                    "code": "TODoLce",
                    "image": null
                }
            }
        },
        {
            "id": "289",
            "type": "employee_detail",
            "attributes": {
                "employee_details": {
                    "id": 289,
                    "full_name": "Au2",
                    "enrolled": "2022-11-29",
                    "code": "PQQNpNF",
                    "image": null
                }
            }
        },
        {
            "id": "287",
            "type": "employee_detail",
            "attributes": {
                "employee_details": {
                    "id": 287,
                    "full_name": "au1",
                    "enrolled": "2022-11-24",
                    "code": "PQQNpNF",
                    "image": null
                }
            }
        },
        {
            "id": "266",
            "type": "employee_detail",
            "attributes": {
                "employee_details": {
                    "id": 266,
                    "full_name": "Hi",
                    "enrolled": "2022-11-21",
                    "code": "0dyaYPU",
                    "image": null
                }
            }
        },
        {
            "id": "265",
            "type": "employee_detail",
            "attributes": {
                "employee_details": {
                    "id": 265,
                    "full_name": "Technology ",
                    "enrolled": "2022-11-21",
                    "code": "0dyaYPU",
                    "image": null
                }
            }
        },
        {
            "id": "264",
            "type": "employee_detail",
            "attributes": {
                "employee_details": {
                    "id": 264,
                    "full_name": "Roshan lal",
                    "enrolled": "2022-11-19",
                    "code": "dsMyzfJ",
                    "image": null
                }
            }
        },
        {
            "id": "263",
            "type": "employee_detail",
            "attributes": {
                "employee_details": {
                    "id": 263,
                    "full_name": "Jay",
                    "enrolled": "2022-11-19",
                    "code": "dsMyzfJ",
                    "image": null
                }
            }
        },
        {
            "id": "258",
            "type": "employee_detail",
            "attributes": {
                "employee_details": {
                    "id": 258,
                    "full_name": "Rabendra",
                    "enrolled": "2022-11-18",
                    "code": "0dyaYPU",
                    "image": null
                }
            }
        },
        {
            "id": "244",
            "type": "employee_detail",
            "attributes": {
                "employee_details": {
                    "id": 244,
                    "full_name": "cookie user",
                    "enrolled": "2022-11-15",
                    "code": "dsMyzfJ",
                    "image": null
                }
            }
        },
        {
            "id": "243",
            "type": "employee_detail",
            "attributes": {
                "employee_details": {
                    "id": 243,
                    "full_name": "cookie user",
                    "enrolled": "2022-11-15",
                    "code": "dsMyzfJ",
                    "image": null
                }
            }
        },
        {
            "id": "242",
            "type": "employee_detail",
            "attributes": {
                "employee_details": {
                    "id": 242,
                    "full_name": "cookie user",
                    "enrolled": "2022-11-15",
                    "code": "dsMyzfJ",
                    "image": null
                }
            }
        },
        {
            "id": "241",
            "type": "employee_detail",
            "attributes": {
                "employee_details": {
                    "id": 241,
                    "full_name": "cookie user",
                    "enrolled": "2022-11-15",
                    "code": "THEo7Re",
                    "image": null
                }
            }
        },
        {
            "id": "239",
            "type": "employee_detail",
            "attributes": {
                "employee_details": {
                    "id": 239,
                    "full_name": "Jayashree",
                    "enrolled": "2022-11-14",
                    "code": "dsMyzfJ",
                    "image": null
                }
            }
        },
        {
            "id": "236",
            "type": "employee_detail",
            "attributes": {
                "employee_details": {
                    "id": 236,
                    "full_name": "test user",
                    "enrolled": "2022-11-10",
                    "code": "XT5I9mP",
                    "image": null
                }
            }
        },
        {
            "id": "234",
            "type": "employee_detail",
            "attributes": {
                "employee_details": {
                    "id": 234,
                    "full_name": "sonali ",
                    "enrolled": "2022-11-10",
                    "code": "DZZHzv8",
                    "image": null
                }
            }
        },
        {
            "id": "233",
            "type": "employee_detail",
            "attributes": {
                "employee_details": {
                    "id": 233,
                    "full_name": "cookie user",
                    "enrolled": "2022-11-09",
                    "code": "THEo7Re",
                    "image": null
                }
            }
        },
        {
            "id": "232",
            "type": "employee_detail",
            "attributes": {
                "employee_details": {
                    "id": 232,
                    "full_name": "cookie user",
                    "enrolled": "2022-11-09",
                    "code": "X8ixDVx",
                    "image": null
                }
            }
        },
        {
            "id": "231",
            "type": "employee_detail",
            "attributes": {
                "employee_details": {
                    "id": 231,
                    "full_name": "testing comp graph",
                    "enrolled": "2022-11-09",
                    "code": "64PLs8M",
                    "image": null
                }
            }
        },
        {
            "id": "230",
            "type": "employee_detail",
            "attributes": {
                "employee_details": {
                    "id": 230,
                    "full_name": "testing Divay Comp",
                    "enrolled": "2022-11-09",
                    "code": "64PLs8M",
                    "image": null
                }
            }
        },
        {
            "id": "229",
            "type": "employee_detail",
            "attributes": {
                "employee_details": {
                    "id": 229,
                    "full_name": "Dinesh A",
                    "enrolled": "2022-11-09",
                    "code": "64PLs8M",
                    "image": "https://niya-178517-ruby.b178517.dev.eastus.az.svc.builder.cafe/rails/active_storage/blobs/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBWVU9IiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--aabf492cd31e83f9d4aaf2d488685c9956490ce7/profile.jpg"
                }
            }
        },
        {
            "id": "226",
            "type": "employee_detail",
            "attributes": {
                "employee_details": {
                    "id": 226,
                    "full_name": "Maya sridhar",
                    "enrolled": "2022-11-04",
                    "code": "dsMyzfJ",
                    "image": null
                }
            }
        },
        {
            "id": "225",
            "type": "employee_detail",
            "attributes": {
                "employee_details": {
                    "id": 225,
                    "full_name": "preti zinta",
                    "enrolled": "2022-11-03",
                    "code": "DZZHzv8",
                    "image": null
                }
            }
        },
        {
            "id": "224",
            "type": "employee_detail",
            "attributes": {
                "employee_details": {
                    "id": 224,
                    "full_name": "Test user",
                    "enrolled": "2022-11-03",
                    "code": "DZZHzv8",
                    "image": null
                }
            }
        },
        {
            "id": "221",
            "type": "employee_detail",
            "attributes": {
                "employee_details": {
                    "id": 221,
                    "full_name": "sonali har",
                    "enrolled": "2022-10-28",
                    "code": "DZZHzv8",
                    "image": null
                }
            }
        },
        {
            "id": "220",
            "type": "employee_detail",
            "attributes": {
                "employee_details": {
                    "id": 220,
                    "full_name": "nita ",
                    "enrolled": "2022-10-28",
                    "code": "DZZHzv8",
                    "image": null
                }
            }
        },
        {
            "id": "219",
            "type": "employee_detail",
            "attributes": {
                "employee_details": {
                    "id": 219,
                    "full_name": "Niyachat",
                    "enrolled": "2022-10-28",
                    "code": "X8ixDVx",
                    "image": null
                }
            }
        },
        {
            "id": "218",
            "type": "employee_detail",
            "attributes": {
                "employee_details": {
                    "id": 218,
                    "full_name": "Bb",
                    "enrolled": "2022-10-27",
                    "code": "TODoLce",
                    "image": null
                }
            }
        },
        {
            "id": "215",
            "type": "employee_detail",
            "attributes": {
                "employee_details": {
                    "id": 215,
                    "full_name": "cookie user",
                    "enrolled": "2022-10-26",
                    "code": "DZZHzv8",
                    "image": null
                }
            }
        },
        {
            "id": "214",
            "type": "employee_detail",
            "attributes": {
                "employee_details": {
                    "id": 214,
                    "full_name": "Srinivasan",
                    "enrolled": "2022-10-23",
                    "code": "DZZHzv8",
                    "image": "https://niya-178517-ruby.b178517.dev.eastus.az.svc.builder.cafe/rails/active_storage/blobs/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBZUT09IiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--ed9f3086b0b2e6e2cd28ac2a2c7bf0907ac09172/profile.jpg"
                }
            }
        },
        {
            "id": "213",
            "type": "employee_detail",
            "attributes": {
                "employee_details": {
                    "id": 213,
                    "full_name": "Jayashree",
                    "enrolled": "2022-10-21",
                    "code": "dsMyzfJ",
                    "image": null
                }
            }
        },
        {
            "id": "212",
            "type": "employee_detail",
            "attributes": {
                "employee_details": {
                    "id": 212,
                    "full_name": "emo tsting",
                    "enrolled": "2022-10-20",
                    "code": "DZZHzv8",
                    "image": null
                }
            }
        },
        {
            "id": "211",
            "type": "employee_detail",
            "attributes": {
                "employee_details": {
                    "id": 211,
                    "full_name": "cookie user",
                    "enrolled": "2022-10-19",
                    "code": "DZZHzv8",
                    "image": null
                }
            }
        },
        {
            "id": "210",
            "type": "employee_detail",
            "attributes": {
                "employee_details": {
                    "id": 210,
                    "full_name": "Nivi",
                    "enrolled": "2022-10-19",
                    "code": "TODoLce",
                    "image": null
                }
            }
        },
        {
            "id": "209",
            "type": "employee_detail",
            "attributes": {
                "employee_details": {
                    "id": 209,
                    "full_name": "Surya",
                    "enrolled": "2022-10-19",
                    "code": "TODoLce",
                    "image": null
                }
            }
        },
        {
            "id": "208",
            "type": "employee_detail",
            "attributes": {
                "employee_details": {
                    "id": 208,
                    "full_name": "Rabendra",
                    "enrolled": "2022-10-19",
                    "code": "DZZHzv8",
                    "image": null
                }
            }
        },
        {
            "id": "207",
            "type": "employee_detail",
            "attributes": {
                "employee_details": {
                    "id": 207,
                    "full_name": "emo tsting",
                    "enrolled": "2022-10-19",
                    "code": "DZZHzv8",
                    "image": null
                }
            }
        },
        {
            "id": "206",
            "type": "employee_detail",
            "attributes": {
                "employee_details": {
                    "id": 206,
                    "full_name": "niya new profile",
                    "enrolled": "2022-10-19",
                    "code": "DZZHzv8",
                    "image": null
                }
            }
        },
        {
            "id": "205",
            "type": "employee_detail",
            "attributes": {
                "employee_details": {
                    "id": 205,
                    "full_name": "DivyaPrakash",
                    "enrolled": "2022-10-18",
                    "code": "DZZHzv8",
                    "image": "https://niya-178517-ruby.b178517.dev.eastus.az.svc.builder.cafe/rails/active_storage/blobs/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBYdz09IiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--f75b4141d372783e05bcaa9c1ec52d0f9c428cee/GNG-mailer.jpg"
                }
            }
        },
        {
            "id": "204",
            "type": "employee_detail",
            "attributes": {
                "employee_details": {
                    "id": 204,
                    "full_name": "Amar",
                    "enrolled": "2022-10-18",
                    "code": "DZZHzv8",
                    "image": null
                }
            }
        },
        {
            "id": "203",
            "type": "employee_detail",
            "attributes": {
                "employee_details": {
                    "id": 203,
                    "full_name": "",
                    "enrolled": "2022-10-18",
                    "code": "DZZHzv8",
                    "image": null
                }
            }
        },
        {
            "id": "202",
            "type": "employee_detail",
            "attributes": {
                "employee_details": {
                    "id": 202,
                    "full_name": "Amar test",
                    "enrolled": "2022-10-17",
                    "code": "DZZHzv8",
                    "image": "https://niya-178517-ruby.b178517.dev.eastus.az.svc.builder.cafe/rails/active_storage/blobs/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBYQT09IiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--11da8724c6339fd220855b7284223716f676f666/profile.jpg"
                }
            }
        },
        {
            "id": "200",
            "type": "employee_detail",
            "attributes": {
                "employee_details": {
                    "id": 200,
                    "full_name": "sonali new user",
                    "enrolled": "2022-10-17",
                    "code": "DZZHzv8",
                    "image": null
                }
            }
        },
        {
            "id": "198",
            "type": "employee_detail",
            "attributes": {
                "employee_details": {
                    "id": 198,
                    "full_name": "niya  doll",
                    "enrolled": "2022-10-17",
                    "code": "DZZHzv8",
                    "image": null
                }
            }
        },
        {
            "id": "197",
            "type": "employee_detail",
            "attributes": {
                "employee_details": {
                    "id": 197,
                    "full_name": "manisha pate",
                    "enrolled": "2022-10-17",
                    "code": "DZZHzv8",
                    "image": null
                }
            }
        },
        {
            "id": "196",
            "type": "employee_detail",
            "attributes": {
                "employee_details": {
                    "id": 196,
                    "full_name": "heade",
                    "enrolled": "2022-10-17",
                    "code": "DZZHzv8",
                    "image": null
                }
            }
        },
        {
            "id": "195",
            "type": "employee_detail",
            "attributes": {
                "employee_details": {
                    "id": 195,
                    "full_name": "sonali new user",
                    "enrolled": "2022-10-17",
                    "code": "DZZHzv8",
                    "image": null
                }
            }
        },
        {
            "id": "194",
            "type": "employee_detail",
            "attributes": {
                "employee_details": {
                    "id": 194,
                    "full_name": "testing new flow",
                    "enrolled": "2022-10-17",
                    "code": "DZZHzv8",
                    "image": null
                }
            }
        },
        {
            "id": "193",
            "type": "employee_detail",
            "attributes": {
                "employee_details": {
                    "id": 193,
                    "full_name": "sonali H",
                    "enrolled": "2022-10-17",
                    "code": "DZZHzv8",
                    "image": "https://niya-178517-ruby.b178517.dev.eastus.az.svc.builder.cafe/rails/active_storage/blobs/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBXZz09IiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--4cfdc14486234ade9d0c94f6032c4d79c136a1af/profile.jpg"
                }
            }
        },
        {
            "id": "192",
            "type": "employee_detail",
            "attributes": {
                "employee_details": {
                    "id": 192,
                    "full_name": "",
                    "enrolled": "2022-10-17",
                    "code": "DZZHzv8",
                    "image": null
                }
            }
        },
        {
            "id": "191",
            "type": "employee_detail",
            "attributes": {
                "employee_details": {
                    "id": 191,
                    "full_name": "testing nav",
                    "enrolled": "2022-10-17",
                    "code": "DZZHzv8",
                    "image": "https://niya-178517-ruby.b178517.dev.eastus.az.svc.builder.cafe/rails/active_storage/blobs/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBXUT09IiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--eef7b1c5e3ba14fb8c33a4029990634f4b859202/profile.jpg"
                }
            }
        },
        {
            "id": "190",
            "type": "employee_detail",
            "attributes": {
                "employee_details": {
                    "id": 190,
                    "full_name": "first user",
                    "enrolled": "2022-10-17",
                    "code": "DZZHzv8",
                    "image": null
                }
            }
        },
        {
            "id": "189",
            "type": "employee_detail",
            "attributes": {
                "employee_details": {
                    "id": 189,
                    "full_name": "sonali",
                    "enrolled": "2022-10-17",
                    "code": "DZZHzv8",
                    "image": null
                }
            }
        },
        {
            "id": "188",
            "type": "employee_detail",
            "attributes": {
                "employee_details": {
                    "id": 188,
                    "full_name": "Amarjeet ",
                    "enrolled": "2022-10-17",
                    "code": "DZZHzv8",
                    "image": null
                }
            }
        },
        {
            "id": "187",
            "type": "employee_detail",
            "attributes": {
                "employee_details": {
                    "id": 187,
                    "full_name": "Amarjeet",
                    "enrolled": "2022-10-17",
                    "code": "DZZHzv8",
                    "image": "https://niya-178517-ruby.b178517.dev.eastus.az.svc.builder.cafe/rails/active_storage/blobs/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBXQT09IiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--822cd26e535eaf52444ab5b5cc7662c42cfbf58a/profile.jpg"
                }
            }
        },
        {
            "id": "186",
            "type": "employee_detail",
            "attributes": {
                "employee_details": {
                    "id": 186,
                    "full_name": "DD",
                    "enrolled": "2022-10-17",
                    "code": "DZZHzv8",
                    "image": null
                }
            }
        },
        {
            "id": "185",
            "type": "employee_detail",
            "attributes": {
                "employee_details": {
                    "id": 185,
                    "full_name": "Divya",
                    "enrolled": "2022-10-17",
                    "code": "DZZHzv8",
                    "image": "https://niya-178517-ruby.b178517.dev.eastus.az.svc.builder.cafe/rails/active_storage/blobs/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBWdz09IiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--403b96a02bb5f03f8dc1fb45e153ea30a3b4c87f/profile.jpg"
                }
            }
        },
        {
            "id": "184",
            "type": "employee_detail",
            "attributes": {
                "employee_details": {
                    "id": 184,
                    "full_name": "new build",
                    "enrolled": "2022-10-14",
                    "code": "DZZHzv8",
                    "image": null
                }
            }
        },
        {
            "id": "183",
            "type": "employee_detail",
            "attributes": {
                "employee_details": {
                    "id": 183,
                    "full_name": "mergin",
                    "enrolled": "2022-10-14",
                    "code": "DZZHzv8",
                    "image": null
                }
            }
        },
        {
            "id": "182",
            "type": "employee_detail",
            "attributes": {
                "employee_details": {
                    "id": 182,
                    "full_name": "Raj",
                    "enrolled": "2022-10-14",
                    "code": "DZZHzv8",
                    "image": null
                }
            }
        },
        {
            "id": "181",
            "type": "employee_detail",
            "attributes": {
                "employee_details": {
                    "id": 181,
                    "full_name": "new test1",
                    "enrolled": "2022-10-14",
                    "code": "DZZHzv8",
                    "image": null
                }
            }
        },
        {
            "id": "180",
            "type": "employee_detail",
            "attributes": {
                "employee_details": {
                    "id": 180,
                    "full_name": "new  acc",
                    "enrolled": "2022-10-14",
                    "code": "DZZHzv8",
                    "image": null
                }
            }
        },
        {
            "id": "179",
            "type": "employee_detail",
            "attributes": {
                "employee_details": {
                    "id": 179,
                    "full_name": "testing new user",
                    "enrolled": "2022-10-14",
                    "code": "DZZHzv8",
                    "image": null
                }
            }
        },
        {
            "id": "178",
            "type": "employee_detail",
            "attributes": {
                "employee_details": {
                    "id": 178,
                    "full_name": "sonali routing flow ha ha ah ah a",
                    "enrolled": "2022-10-14",
                    "code": "DZZHzv8",
                    "image": "https://niya-178517-ruby.b178517.dev.eastus.az.svc.builder.cafe/rails/active_storage/blobs/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBWZz09IiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--2c6842e8bdaaf8b2daf323f7be97bf8e2e85d922/profile.jpg"
                }
            }
        },
        {
            "id": "177",
            "type": "employee_detail",
            "attributes": {
                "employee_details": {
                    "id": 177,
                    "full_name": "sonali tesint",
                    "enrolled": "2022-10-14",
                    "code": "DZZHzv8",
                    "image": null
                }
            }
        },
        {
            "id": "176",
            "type": "employee_detail",
            "attributes": {
                "employee_details": {
                    "id": 176,
                    "full_name": "testing flow",
                    "enrolled": "2022-10-14",
                    "code": "DZZHzv8",
                    "image": null
                }
            }
        },
        {
            "id": "175",
            "type": "employee_detail",
            "attributes": {
                "employee_details": {
                    "id": 175,
                    "full_name": "sonali tesing signu",
                    "enrolled": "2022-10-14",
                    "code": "DZZHzv8",
                    "image": null
                }
            }
        },
        {
            "id": "174",
            "type": "employee_detail",
            "attributes": {
                "employee_details": {
                    "id": 174,
                    "full_name": "Xyz",
                    "enrolled": "2022-10-14",
                    "code": "dsMyzfJ",
                    "image": null
                }
            }
        },
        {
            "id": "172",
            "type": "employee_detail",
            "attributes": {
                "employee_details": {
                    "id": 172,
                    "full_name": "DP",
                    "enrolled": "2022-10-14",
                    "code": "DZZHzv8",
                    "image": null
                }
            }
        },
        {
            "id": "152",
            "type": "employee_detail",
            "attributes": {
                "employee_details": {
                    "id": 152,
                    "full_name": "Coach user",
                    "enrolled": "2022-10-08",
                    "code": "2",
                    "image": null
                }
            }
        },
        {
            "id": "102",
            "type": "employee_detail",
            "attributes": {
                "employee_details": {
                    "id": 102,
                    "full_name": " Nidhi ",
                    "enrolled": "2022-09-20",
                    "code": "64PLs8M",
                    "image": "https://niya-178517-ruby.b178517.dev.eastus.az.svc.builder.cafe/rails/active_storage/blobs/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBWjg9IiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--74999e68416752aa28b529b3156de8c769e0be7d/profile.jpg"
                }
            }
        },
        {
            "id": "84",
            "type": "employee_detail",
            "attributes": {
                "employee_details": {
                    "id": 84,
                    "full_name": " Jayashree",
                    "enrolled": "2022-09-16",
                    "code": "64PLs8M",
                    "image": "https://niya-178517-ruby.b178517.dev.eastus.az.svc.builder.cafe/rails/active_storage/blobs/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBWnM9IiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--bfd230562de0ad11910b27e89b63fbdad4c2be7c/profile.jpg"
                }
            }
        },
        {
            "id": "68",
            "type": "employee_detail",
            "attributes": {
                "employee_details": {
                    "id": 68,
                    "full_name": "demo demo",
                    "enrolled": "2022-09-01",
                    "code": "64PLs8M",
                    "image": "https://niya-178517-ruby.b178517.dev.eastus.az.svc.builder.cafe/rails/active_storage/blobs/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBCdz09IiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--5daa0c70f80382d20465b997369bc9e4e9e9aab5/download.png"
                }
            }
        },
        {
            "id": "42",
            "type": "employee_detail",
            "attributes": {
                "employee_details": {
                    "id": 42,
                    "full_name": "sonali Hello",
                    "enrolled": "2022-08-23",
                    "code": "DZZHzv8",
                    "image": "https://niya-178517-ruby.b178517.dev.eastus.az.svc.builder.cafe/rails/active_storage/blobs/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBaQT09IiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--a4e3d39c0d2af121a24aed1f08d9d067f5bed31d/profile.jpg"
                }
            }
        },
        {
            "id": "27",
            "type": "employee_detail",
            "attributes": {
                "employee_details": {
                    "id": 27,
                    "full_name": "Sonali H",
                    "enrolled": "2022-08-16",
                    "code": "64PLs8M",
                    "image": null
                }
            }
        }
    ]
}

const coachesData={
    "data": [
        {
            "id": "310",
            "type": "coach_detail",
            "attributes": {
                "coach_details": {
                    "id": 310,
                    "full_name": "coach99",
                    "expertise": [
                        {
                            "specialization": "Work Life Balance",
                            "id": 5
                        },
                        {
                            "specialization": "Role Conflict",
                            "id": 9
                        }
                    ],
                    "enrolled": "2022-12-07",
                    "city": "",
                    "image": null
                }
            }
        },
        {
            "id": "328",
            "type": "coach_detail",
            "attributes": {
                "coach_details": {
                    "id": 328,
                    "full_name": "coach60",
                    "expertise": [
                        {
                            "specialization": "Abusive Relationships",
                            "id": 30
                        },
                        {
                            "specialization": "Role Conflict",
                            "id": 9
                        }
                    ],
                    "enrolled": "2022-12-09",
                    "city": "",
                    "image": null
                }
            }
        },
        {
            "id": "320",
            "type": "coach_detail",
            "attributes": {
                "coach_details": {
                    "id": 320,
                    "full_name": "CoachIndia",
                    "expertise": [
                        {
                            "specialization": "Work Life Balance",
                            "id": 5
                        },
                        {
                            "specialization": "Workplace Conflict",
                            "id": 7
                        },
                        {
                            "specialization": "Gender Identity Issues",
                            "id": 15
                        },
                        {
                            "specialization": "Self Esteem",
                            "id": 19
                        },
                        {
                            "specialization": "Autism spectrum",
                            "id": 23
                        },
                        {
                            "specialization": "Relationship Issues",
                            "id": 25
                        },
                        {
                            "specialization": "Family issues",
                            "id": 28
                        },
                        {
                            "specialization": "Marital Confilct",
                            "id": 29
                        },
                        {
                            "specialization": "Role Conflict",
                            "id": 9
                        }
                    ],
                    "enrolled": "2022-12-09",
                    "city": "",
                    "image": null
                }
            }
        },
        {
            "id": "362",
            "type": "coach_detail",
            "attributes": {
                "coach_details": {
                    "id": 362,
                    "full_name": "coach60",
                    "expertise": [
                        {
                            "specialization": "Abusive Relationships",
                            "id": 30
                        }
                    ],
                    "enrolled": "2022-12-22",
                    "city": null,
                    "image": null
                }
            }
        },
        {
            "id": "365",
            "type": "coach_detail",
            "attributes": {
                "coach_details": {
                    "id": 365,
                    "full_name": "coach sona ",
                    "expertise": [
                        {
                            "specialization": "Workplace Anxiety",
                            "id": 2
                        },
                        {
                            "specialization": "Leadership Issues",
                            "id": 3
                        }
                    ],
                    "enrolled": "2022-12-22",
                    "city": null,
                    "image": null
                }
            }
        },
        {
            "id": "312",
            "type": "coach_detail",
            "attributes": {
                "coach_details": {
                    "id": 312,
                    "full_name": "coach78",
                    "expertise": [],
                    "enrolled": "2022-12-07",
                    "city": null,
                    "image": null
                }
            }
        },
        {
            "id": "302",
            "type": "coach_detail",
            "attributes": {
                "coach_details": {
                    "id": 302,
                    "full_name": "coach99",
                    "expertise": [],
                    "enrolled": "2022-12-06",
                    "city": null,
                    "image": null
                }
            }
        },
        {
            "id": "313",
            "type": "coach_detail",
            "attributes": {
                "coach_details": {
                    "id": 313,
                    "full_name": "coach59",
                    "expertise": [
                        {
                            "specialization": "Abusive Relationships",
                            "id": 30
                        },
                        {
                            "specialization": "Role Conflict",
                            "id": 9
                        }
                    ],
                    "enrolled": "2022-12-07",
                    "city": "",
                    "image": null
                }
            }
        },
        {
            "id": "135",
            "type": "coach_detail",
            "attributes": {
                "coach_details": {
                    "id": 135,
                    "full_name": "coach12 edited name ",
                    "expertise": [
                        {
                            "specialization": "Diversity and Inclusion At work",
                            "id": 8
                        },
                        {
                            "specialization": "Role Conflict",
                            "id": 9
                        },
                        {
                            "specialization": "Workplace Relationships",
                            "id": 10
                        }
                    ],
                    "enrolled": "2022-10-05",
                    "city": "Mumbai",
                    "image": "https://niya-178517-ruby.b178517.dev.eastus.az.svc.builder.cafe/rails/active_storage/blobs/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBWU09IiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--147c14d543e1cdc3103c5171167e80e38df9545b/download.png"
                }
            }
        },
        {
            "id": "329",
            "type": "coach_detail",
            "attributes": {
                "coach_details": {
                    "id": 329,
                    "full_name": "coach61",
                    "expertise": [
                        {
                            "specialization": "Role Conflict",
                            "id": 9
                        }
                    ],
                    "enrolled": "2022-12-09",
                    "city": "",
                    "image": null
                }
            }
        },
     
        {
            "id": "306",
            "type": "coach_detail",
            "attributes": {
                "coach_details": {
                    "id": 306,
                    "full_name": "coach87",
                    "expertise": [
                        {
                            "specialization": "Role Conflict",
                            "id": 9
                        }
                    ],
                    "enrolled": "2022-12-07",
                    "city": "",
                    "image": null
                }
            }
        },
        {
            "id": "228",
            "type": "coach_detail",
            "attributes": {
                "coach_details": {
                    "id": 228,
                    "full_name": "coach21",
                    "expertise": [],
                    "enrolled": "2022-11-07",
                    "city": "",
                    "image": null
                }
            }
        },
        {
            "id": "223",
            "type": "coach_detail",
            "attributes": {
                "coach_details": {
                    "id": 223,
                    "full_name": "coachsona",
                    "expertise": [
                        {
                            "specialization": "Workplace Anxiety",
                            "id": 2
                        },
                        {
                            "specialization": "Workplace Performance",
                            "id": 4
                        },
                        {
                            "specialization": "Work Life Balance",
                            "id": 5
                        },
                        {
                            "specialization": "Workplace communication",
                            "id": 6
                        },
                        {
                            "specialization": "Marital Confilct",
                            "id": 29
                        },
                        {
                            "specialization": "Abusive Relationships",
                            "id": 30
                        }
                    ],
                    "enrolled": "2022-11-03",
                    "city": "",
                    "image": null
                }
            }
        },
        {
            "id": "217",
            "type": "coach_detail",
            "attributes": {
                "coach_details": {
                    "id": 217,
                    "full_name": "coach coach 19",
                    "expertise": [],
                    "enrolled": "2022-10-27",
                    "city": "",
                    "image": null
                }
            }
        },
        {
            "id": "238",
            "type": "coach_detail",
            "attributes": {
                "coach_details": {
                    "id": 238,
                    "full_name": "testings user",
                    "expertise": [],
                    "enrolled": "2022-11-10",
                    "city": null,
                    "image": null
                }
            }
        },
        {
            "id": "324",
            "type": "coach_detail",
            "attributes": {
                "coach_details": {
                    "id": 324,
                    "full_name": "hmm",
                    "expertise": [],
                    "enrolled": "2022-12-09",
                    "city": null,
                    "image": null
                }
            }
        },
        {
            "id": "240",
            "type": "coach_detail",
            "attributes": {
                "coach_details": {
                    "id": 240,
                    "full_name": "coach 15",
                    "expertise": [],
                    "enrolled": "2022-11-15",
                    "city": null,
                    "image": null
                }
            }
        },
        {
            "id": "261",
            "type": "coach_detail",
            "attributes": {
                "coach_details": {
                    "id": 261,
                    "full_name": "coachsona",
                    "expertise": [
                        {
                            "specialization": "Abusive Relationships",
                            "id": 30
                        }
                    ],
                    "enrolled": "2022-11-19",
                    "city": null,
                    "image": null
                }
            }
        },
        {
            "id": "246",
            "type": "coach_detail",
            "attributes": {
                "coach_details": {
                    "id": 246,
                    "full_name": "Coach Chat",
                    "expertise": [],
                    "enrolled": "2022-11-15",
                    "city": null,
                    "image": "https://niya-178517-ruby.b178517.dev.eastus.az.svc.builder.cafe/rails/active_storage/blobs/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBiUT09IiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--becfdd7c704553d6f8111f20af617e24efe08d34/profile.jpg"
                }
            }
        },
        {
            "id": "254",
            "type": "coach_detail",
            "attributes": {
                "coach_details": {
                    "id": 254,
                    "full_name": "coach21",
                    "expertise": [
                        {
                            "specialization": "Abusive Relationships",
                            "id": 30
                        }
                    ],
                    "enrolled": "2022-11-18",
                    "city": null,
                    "image": null
                }
            }
        },
        {
            "id": "330",
            "type": "coach_detail",
            "attributes": {
                "coach_details": {
                    "id": 330,
                    "full_name": "CoachInd",
                    "expertise": [
                        {
                            "specialization": "Leadership Issues",
                            "id": 3
                        },
                        {
                            "specialization": "Work Life Balance",
                            "id": 5
                        },
                        {
                            "specialization": "Role Conflict",
                            "id": 9
                        },
                        {
                            "specialization": "Professional Development",
                            "id": 11
                        },
                        {
                            "specialization": "Toxic Leadership",
                            "id": 13
                        }
                    ],
                    "enrolled": "2022-12-09",
                    "city": null,
                    "image": null
                }
            }
        },
        {
            "id": "255",
            "type": "coach_detail",
            "attributes": {
                "coach_details": {
                    "id": 255,
                    "full_name": "coachsona",
                    "expertise": [
                        {
                            "specialization": "Abusive Relationships",
                            "id": 30
                        }
                    ],
                    "enrolled": "2022-11-18",
                    "city": null,
                    "image": null
                }
            }
        },
        {
            "id": "256",
            "type": "coach_detail",
            "attributes": {
                "coach_details": {
                    "id": 256,
                    "full_name": "coach21",
                    "expertise": [
                        {
                            "specialization": "Abusive Relationships",
                            "id": 30
                        }
                    ],
                    "enrolled": "2022-11-18",
                    "city": null,
                    "image": null
                }
            }
        },
        {
            "id": "257",
            "type": "coach_detail",
            "attributes": {
                "coach_details": {
                    "id": 257,
                    "full_name": "coach21",
                    "expertise": [
                        {
                            "specialization": "Career Management",
                            "id": 1
                        },
                        {
                            "specialization": "Leadership Issues",
                            "id": 3
                        }
                    ],
                    "enrolled": "2022-11-18",
                    "city": null,
                    "image": null
                }
            }
        },
        {
            "id": "259",
            "type": "coach_detail",
            "attributes": {
                "coach_details": {
                    "id": 259,
                    "full_name": "coachsona",
                    "expertise": [
                        {
                            "specialization": "Abusive Relationships",
                            "id": 30
                        }
                    ],
                    "enrolled": "2022-11-18",
                    "city": null,
                    "image": null
                }
            }
        },
        {
            "id": "260",
            "type": "coach_detail",
            "attributes": {
                "coach_details": {
                    "id": 260,
                    "full_name": "testing coach",
                    "expertise": [
                        {
                            "specialization": "Workplace Anxiety",
                            "id": 2
                        }
                    ],
                    "enrolled": "2022-11-19",
                    "city": null,
                    "image": null
                }
            }
        },
        {
            "id": "262",
            "type": "coach_detail",
            "attributes": {
                "coach_details": {
                    "id": 262,
                    "full_name": "smith coach",
                    "expertise": [
                        {
                            "specialization": "Workplace Anxiety",
                            "id": 2
                        },
                        {
                            "specialization": "Leadership Issues",
                            "id": 3
                        }
                    ],
                    "enrolled": "2022-11-19",
                    "city": null,
                    "image": null
                }
            }
        },
       
        {
            "id": "326",
            "type": "coach_detail",
            "attributes": {
                "coach_details": {
                    "id": 326,
                    "full_name": "time",
                    "expertise": [
                        {
                            "specialization": "Role Conflict",
                            "id": 9
                        }
                    ],
                    "enrolled": "2022-12-09",
                    "city": "",
                    "image": null
                }
            }
        },
        {
            "id": "165",
            "type": "coach_detail",
            "attributes": {
                "coach_details": {
                    "id": 165,
                    "full_name": "coach16 test",
                    "expertise": [
                        {
                            "specialization": "Career Management",
                            "id": 1
                        },
                        {
                            "specialization": "Workplace Anxiety",
                            "id": 2
                        },
                        {
                            "specialization": "Workplace Performance",
                            "id": 4
                        },
                        {
                            "specialization": "Work Life Balance",
                            "id": 5
                        },
                        {
                            "specialization": "Workplace communication",
                            "id": 6
                        },
                        {
                            "specialization": "Workplace Conflict",
                            "id": 7
                        },
                        {
                            "specialization": "Professional Development",
                            "id": 11
                        },
                        {
                            "specialization": "Toxic Leadership",
                            "id": 13
                        },
                        {
                            "specialization": "Gender Identity Issues",
                            "id": 15
                        },
                        {
                            "specialization": "Cultural Identity issues",
                            "id": 16
                        },
                        {
                            "specialization": "Trauma",
                            "id": 17
                        },
                        {
                            "specialization": "Grief",
                            "id": 18
                        },
                        {
                            "specialization": "OCD",
                            "id": 21
                        },
                        {
                            "specialization": "ADHD",
                            "id": 22
                        },
                        {
                            "specialization": "Parenting problems",
                            "id": 26
                        },
                        {
                            "specialization": "Family issues",
                            "id": 28
                        },
                        {
                            "specialization": "Abusive Relationships",
                            "id": 30
                        },
                        {
                            "specialization": "Role Conflict",
                            "id": 9
                        }
                    ],
                    "enrolled": "2022-10-13",
                    "city": "Calcutta",
                    "image": "https://niya-178517-ruby.b178517.dev.eastus.az.svc.builder.cafe/rails/active_storage/blobs/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBZQT09IiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--81efa2fb205d0139b5b54f3c22f40e73205a255c/profile.jpg"
                }
            }
        },
        {
            "id": "366",
            "type": "coach_detail",
            "attributes": {
                "coach_details": {
                    "id": 366,
                    "full_name": "coach1oo test",
                    "expertise": [
                        {
                            "specialization": "Workplace Anxiety",
                            "id": 2
                        },
                        {
                            "specialization": "Leadership Issues",
                            "id": 3
                        },
                        {
                            "specialization": "Workplace Performance",
                            "id": 4
                        }
                    ],
                    "enrolled": "2022-12-22",
                    "city": null,
                    "image": null
                }
            }
        },
        {
            "id": "370",
            "type": "coach_detail",
            "attributes": {
                "coach_details": {
                    "id": 370,
                    "full_name": "Coach AE",
                    "expertise": [
                        {
                            "specialization": "Existential issues",
                            "id": 20
                        },
                        {
                            "specialization": "OCD",
                            "id": 21
                        },
                        {
                            "specialization": "ADHD",
                            "id": 22
                        },
                        {
                            "specialization": "Autism spectrum",
                            "id": 23
                        },
                        {
                            "specialization": "Clinical",
                            "id": 24
                        }
                    ],
                    "enrolled": "2022-12-27",
                    "city": null,
                    "image": null
                }
            }
        },
        {
            "id": "166",
            "type": "coach_detail",
            "attributes": {
                "coach_details": {
                    "id": 166,
                    "full_name": "coach17",
                    "expertise": [
                        {
                            "specialization": "Career Management",
                            "id": 1
                        },
                        {
                            "specialization": "Leadership Issues",
                            "id": 3
                        },
                        {
                            "specialization": "Work Life Balance",
                            "id": 5
                        },
                        {
                            "specialization": "Workplace communication",
                            "id": 6
                        },
                        {
                            "specialization": "Diversity and Inclusion At work",
                            "id": 8
                        },
                        {
                            "specialization": "Role Conflict",
                            "id": 9
                        },
                        {
                            "specialization": "Workplace Relationships",
                            "id": 10
                        },
                        {
                            "specialization": "Toxic Work environment",
                            "id": 12
                        },
                        {
                            "specialization": "Toxic Leadership",
                            "id": 13
                        },
                        {
                            "specialization": "Workplace Bullying",
                            "id": 14
                        },
                        {
                            "specialization": "Cultural Identity issues",
                            "id": 16
                        },
                        {
                            "specialization": "Grief",
                            "id": 18
                        },
                        {
                            "specialization": "OCD",
                            "id": 21
                        },
                        {
                            "specialization": "ADHD",
                            "id": 22
                        },
                        {
                            "specialization": "Autism spectrum",
                            "id": 23
                        },
                        {
                            "specialization": "Relationship Issues",
                            "id": 25
                        },
                        {
                            "specialization": "Marital Confilct",
                            "id": 29
                        },
                        {
                            "specialization": "Abusive Relationships",
                            "id": 30
                        }
                    ],
                    "enrolled": "2022-10-13",
                    "city": "Delhi",
                    "image": "https://niya-178517-ruby.b178517.dev.eastus.az.svc.builder.cafe/rails/active_storage/blobs/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBVdz09IiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--222c07fe0b594357723676139b74d4f51241e237/download.png"
                }
            }
        },
        {
            "id": "374",
            "type": "coach_detail",
            "attributes": {
                "coach_details": {
                    "id": 374,
                    "full_name": "coach21",
                    "expertise": [
                        {
                            "specialization": "Abusive Relationships",
                            "id": 30
                        }
                    ],
                    "enrolled": "2023-01-02",
                    "city": null,
                    "image": null
                }
            }
        },
        {
            "id": "327",
            "type": "coach_detail",
            "attributes": {
                "coach_details": {
                    "id": 327,
                    "full_name": "haha",
                    "expertise": [
                        {
                            "specialization": "Role Conflict",
                            "id": 9
                        }
                    ],
                    "enrolled": "2022-12-09",
                    "city": "",
                    "image": null
                }
            }
        },
        {
            "id": "303",
            "type": "coach_detail",
            "attributes": {
                "coach_details": {
                    "id": 303,
                    "full_name": "CoachFifa",
                    "expertise": [
                        {
                            "specialization": "Workplace Conflict",
                            "id": 7
                        },
                        {
                            "specialization": "Workplace Relationships",
                            "id": 10
                        },
                        {
                            "specialization": "Professional Development",
                            "id": 11
                        },
                        {
                            "specialization": "Toxic Leadership",
                            "id": 13
                        },
                        {
                            "specialization": "Cultural Identity issues",
                            "id": 16
                        },
                        {
                            "specialization": "OCD",
                            "id": 21
                        },
                        {
                            "specialization": "Clinical",
                            "id": 24
                        },
                        {
                            "specialization": "Relationship Issues",
                            "id": 25
                        },
                        {
                            "specialization": "Role Conflict",
                            "id": 9
                        }
                    ],
                    "enrolled": "2022-12-06",
                    "city": "",
                    "image": null
                }
            }
        },
        {
            "id": "367",
            "type": "coach_detail",
            "attributes": {
                "coach_details": {
                    "id": 367,
                    "full_name": "unach coach",
                    "expertise": [
                        {
                            "specialization": "Leadership Issues",
                            "id": 3
                        },
                        {
                            "specialization": "Workplace Performance",
                            "id": 4
                        }
                    ],
                    "enrolled": "2022-12-23",
                    "city": "",
                    "image": null
                }
            }
        }
    ]
}

const deviceTokenUpdate={
    "data": {
        "id": 7,
        "device_token": "asdflajsldflasjdflasdf",
        "account_id": 242,
        "created_at": "2022-11-24T05:18:55.470Z",
        "updated_at": "2023-01-02T11:46:59.966Z"
    }
}

const feature = loadFeature('./__tests__/features/CoachList-scenario.feature');

defineFeature(feature, (test) => {


    beforeEach(() => {
        jest.mock('react-native-drawer', () => {
            return {
              addEventListener: jest.fn(),
              createDrawerNavigator: jest.fn()
            }
          });  
        jest.spyOn(runEngine, "sendMessage");  
       
        jest.resetModules();
        jest.doMock('react-native', () => ({ Platform: { OS: 'web' }}));
        jest.spyOn(helpers, 'getOS').mockImplementation(() => 'web');
           
    });

    afterEach(()=>{
        jest.runAllTimers();
      })


    test('User navigates to CoachList', ({ given, when, then }) => {
        let exampleBlockA:ShallowWrapper;
        let instance:CoachList; 

        given('I am a User loading CoachList', () => {
            exampleBlockA = shallow(<CoachList {...screenProps}/>);
        });

        when('I navigate to the CoachList', () => {
             instance = exampleBlockA.instance() as CoachList;
             render(<CoachList {...screenProps} />)
             instance.componentDidMount();
             instance.getFocusOn();
             instance.getToken();
             instance.setState({compid:22,prifileimage:'img.png',coach_prifileimage:"img",
                token:"eyJhbGciOiJIUzUxMiJ9.eyJpZCI6MTkyLCJleHAiOjE2NzIyMjY2ODUsInRva2VuX3R5cGUiOiJsb2dpbiJ9.PY-GehPKm5dK90iVZTxTZBge_U41ctkc6QMFcPBc3HT7gQxwY_rsxt09qoOjCWf5CXwylQ8XV26w1FmMBcyUYA" });
          
            fireEvent.press(screen.getByTestId("btnDrawer"));
            instance.setState({userType:""},()=>{
                instance.getAllDataList();
            })
             fireEvent.press(screen.getByTestId("profile_click"));
             instance.saveFcmTOken("eyJhbGciOiJIUzUxMiJ9.eyJpZCI6MTkyLCJleHAiOjE2NzIyMjY2ODUsInRva2VuX3R5cGUiOiJsb2dpbiJ9.PY-GehPKm5dK90iVZTxTZBge_U41ctkc6QMFcPBc3HT7gQxwY_rsxt09qoOjCWf5CXwylQ8XV26w1FmMBcyUYA");
            
             fireEvent.press(screen.getByTestId("sendNotify_click"));
             fireEvent.press(screen.getByTestId("Privacy_click"));
      
             fireEvent.press(screen.getByTestId("logout_click"));
            
             fireEvent.press(screen.getByTestId("feedback_click"));
            
          
        });  
        then("Response token from the session", () => {
            instance.componentDidMount();
            instance.getAllDataList();
           
            const tokenMsg1 = new Message(
              getName(MessageEnum.SessionResponseMessage)
            );
      
            tokenMsg1.addData(
              getName(MessageEnum.SessionResponseToken),
              "eyJhbGciOiJIUzUxMiJ9.eyJpZCI6MTkyLCJleHAiOjE2NzIyMjY2ODUsInRva2VuX3R5cGUiOiJsb2dpbiJ9.PY-GehPKm5dK90iVZTxTZBge_U41ctkc6QMFcPBc3HT7gQxwY_rsxt09qoOjCWf5CXwylQ8XV26w1FmMBcyUYA"
            )
      
            runEngine.sendMessage('From unut test', tokenMsg1);
          });
        then('Network response for get all requests',()=>{
            instance.setState({userType:"Companies",DataList:companyData?.data});
            const msg = new Message(
                getName(MessageEnum.RestAPIResponceMessage)
              );
        
              msg.addData(
                getName(MessageEnum.RestAPIResponceDataMessage),
                msg.messageId
              )
        
              msg.addData(
                getName(MessageEnum.RestAPIResponceSuccessMessage),
                companyData
              )
              instance.getEmployeesApiCallId = msg.messageId
              runEngine.sendMessage('From unit test', msg);
           
              
        });   
         
        then('Network response for get User Groups data requests',()=>{

            instance.setState({companyList:[{"attributes": 
            {"id":4,"name":"builder","address": "Delhi NCR","company_date": "2022-11-04", "email": "builderedit@gmail.com", "employee_code": "DZZHzv8", 
            
            "hr_code": "pBMc1E",  "company_image": "imgcomp.png"}}]})
            instance.renderCompanyList();
            instance.setState({userType:"User Groups",DataList:userGroupsdata?.data});
           
            const msg = new Message(
                getName(MessageEnum.RestAPIResponceMessage)
              );
        
              msg.addData(
                getName(MessageEnum.RestAPIResponceDataMessage),
                msg.messageId
              )
        
              msg.addData(
                getName(MessageEnum.RestAPIResponceSuccessMessage),
                userGroupsdata
              )
              instance.getEmployeesApiCallId = msg.messageId
              runEngine.sendMessage('From unit test', msg);

              

        }); 
        then('Network response for get coaches data requests',()=>{
            instance.setState({ugList:[{"attributes":{"employee_details":{"code":"101","enrolled":"ds",   "full_name": "sonali Hello",}}}],userType:"User Groups"})
            instance.renderList();
            instance.setState({userType:"Coaches",DataList:coachesData?.data});
          
            const msg = new Message(
                getName(MessageEnum.RestAPIResponceMessage)
              );
        
              msg.addData(
                getName(MessageEnum.RestAPIResponceDataMessage),
                msg.messageId
              )
        
              msg.addData(
                getName(MessageEnum.RestAPIResponceSuccessMessage),
                coachesData
              )
              instance.getEmployeesApiCallId = msg.messageId
              runEngine.sendMessage('From unit test', msg);

              
        });      

        then('CoachList will load with out errors', () => {
            expect(exampleBlockA).toBeTruthy();
            instance.renderCoachList();

            let btnCoach = exampleBlockA.findWhere((node) => node.prop('testID') === 'coachid0');
            btnCoach.simulate('press');

            let txtSearchstr = exampleBlockA.findWhere((node) => node.prop('testID') === 'txtSearchstr');
            txtSearchstr.simulate('changeText', "Google");
            
             let btnSearch = exampleBlockA.findWhere((node) => node.prop('testID') === 'btnSearch');
             btnSearch.simulate('press');

             let btnNavigation = exampleBlockA.findWhere((node) => node.prop('testID') === 'btnNavigation');
            
             instance.logOut();
             btnNavigation.simulate('press');
            
                
        });
        then('I can update device token with out errors',()=>{
            const msgdata = new Message(
                getName(MessageEnum.RestAPIResponceMessage)
              );
        
              msgdata.addData(
                getName(MessageEnum.RestAPIResponceDataMessage),
                msgdata.messageId
              )
        
              msgdata.addData(
                getName(MessageEnum.RestAPIResponceSuccessMessage),
                deviceTokenUpdate
              )
              instance.devicetokenApiCallId = msgdata.messageId
              runEngine.sendMessage('From unit test', msgdata);
              
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
              instance.getEmployeesApiCallId = msg.messageId 
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
              instance.getEmployeesApiCallId = msg.messageId
              runEngine.sendMessage('From unit test', msg);
              
        });
        
        then('I can leave the screen with out errors', () => {
            instance.componentWillUnmount()
            expect(exampleBlockA).toBeTruthy();
        });
    });


});
