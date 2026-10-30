-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Acceptance field declarations retain paths and shapes; values and evidence are omitted.
local json = require("json")
return { fields = function(): { any }
    return assert(json.decode([=[
[
  {
    "description": "Extract the formal title of the agreement.",
    "type": "text",
    "path": "agreement.title"
  },
  {
    "description": "Extract the as-of date of this amended and restated agreement.",
    "type": "date",
    "path": "agreement.date"
  },
  {
    "description": "Extract the Published CUSIP Number for the deal.",
    "type": "text",
    "path": "agreement.deal_cusip"
  },
  {
    "description": "Extract the Revolving Credit CUSIP Number.",
    "type": "text",
    "path": "agreement.revolver_cusip"
  },
  {
    "description": "Extract the law governing the agreement.",
    "type": "text",
    "path": "agreement.governing_law"
  },
  {
    "description": "Extract the courts and appellate courts expressly named in the submission-to-jurisdiction clause.",
    "type": "list",
    "item": {
      "type": "text"
    },
    "path": "agreement.submission_to_jurisdiction_courts"
  },
  {
    "description": "Determine whether the parties expressly waive trial by jury.",
    "type": "boolean",
    "path": "agreement.jury_trial_waiver"
  },
  {
    "description": "Extract the legal name of the borrower in the introductory paragraph.",
    "type": "text",
    "path": "parties.borrower.name"
  },
  {
    "description": "Extract the full legal name of the administrative agent.",
    "type": "text",
    "path": "parties.administrative_agent.name"
  },
  {
    "description": "Extract the initially named Swingline Lenders, resolving defined bank names.",
    "type": "list",
    "item": {
      "type": "text"
    },
    "path": "parties.swingline_lenders"
  },
  {
    "description": "Extract the initially named issuers for letters of credit issued on or after Closing Date, resolving defined bank names.",
    "type": "list",
    "item": {
      "type": "text"
    },
    "path": "parties.issuing_lenders"
  },
  {
    "description": "Extract all named Joint Lead Arrangers and Joint Bookrunners.",
    "type": "list",
    "item": {
      "type": "text"
    },
    "path": "parties.joint_lead_arrangers_and_bookrunners"
  },
  {
    "description": "Extract the Co-Syndication Agents named on the cover.",
    "type": "list",
    "item": {
      "type": "text"
    },
    "path": "parties.co_syndication_agents"
  },
  {
    "description": "Extract Documentation Agents exactly as named in the cover-page role listing.",
    "type": "list",
    "item": {
      "type": "text"
    },
    "path": "parties.documentation_agents"
  },
  {
    "description": "Extract the Closing Date aggregate revolving commitment in USD, treating alternative-currency commitments as sublimits.",
    "type": "number",
    "path": "facility.total_revolving_commitment"
  },
  {
    "description": "Extract the aggregate Closing Date Alternative Currency Revolving Credit Commitment in USD.",
    "type": "number",
    "path": "facility.alternative_currency_sublimit"
  },
  {
    "description": "Extract named Alternative Currencies and the conditional category for additional currencies.",
    "type": "list",
    "item": {
      "type": "text"
    },
    "path": "facility.alternative_currencies"
  },
  {
    "description": "Extract the aggregate Swingline Commitment amount and revolving-commitment cap.",
    "type": "object",
    "properties": [
      {
        "name": "amount",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "number"
      },
      {
        "name": "currency",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "text"
      },
      {
        "name": "capped_by",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "text"
      },
      {
        "name": "comparison",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "text"
      }
    ],
    "path": "facility.swingline_sublimit"
  },
  {
    "description": "Extract the aggregate L/C Commitment amount and revolving-commitment cap.",
    "type": "object",
    "properties": [
      {
        "name": "amount",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "number"
      },
      {
        "name": "currency",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "text"
      },
      {
        "name": "capped_by",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "text"
      },
      {
        "name": "comparison",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "text"
      }
    ],
    "path": "facility.lc_sublimit"
  },
  {
    "description": "Extract initial per-lender swingline and issuing sublimits and the discretion to permit greater amounts.",
    "type": "object",
    "properties": [
      {
        "name": "swingline_lender_amount",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "number"
      },
      {
        "name": "issuing_lender_amount",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "number"
      },
      {
        "name": "currency",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "text"
      },
      {
        "name": "issuing_increase_condition",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "text"
      },
      {
        "name": "swingline_increase_condition",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "text"
      }
    ],
    "path": "facility.individual_lender_sublimits"
  },
  {
    "description": "Extract a specified dollar amount of incremental or accordion commitments available under the agreement.",
    "type": "number",
    "path": "facility.incremental_accordion_amount"
  },
  {
    "description": "Extract the scheduled Revolving Maturity Date before optional extensions or earlier termination.",
    "type": "date",
    "path": "facility.scheduled_maturity_date"
  },
  {
    "description": "Extract the events that can end revolving maturity earlier than the scheduled date.",
    "type": "list",
    "item": {
      "type": "text"
    },
    "path": "facility.maturity_earlier_termination_terms"
  },
  {
    "description": "Extract extension count, length, request/response windows, approval threshold, effective timing, replacement right and conditions.",
    "type": "object",
    "properties": [
      {
        "name": "maximum_requests",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "number"
      },
      {
        "name": "years_per_extension",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "number"
      },
      {
        "name": "request_window_days_before_closing_date_anniversary",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "object",
        "properties": [
          {
            "name": "earliest",
            "description": "",
            "enum_values": [],
            "expected_format": "",
            "required": false,
            "type": "number"
          },
          {
            "name": "latest",
            "description": "",
            "enum_values": [],
            "expected_format": "",
            "required": false,
            "type": "number"
          }
        ]
      },
      {
        "name": "lender_response_days_after_notice",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "number"
      },
      {
        "name": "silence_result",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "text"
      },
      {
        "name": "minimum_extending_commitments_percent",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "number"
      },
      {
        "name": "threshold_comparison",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "text"
      },
      {
        "name": "threshold_denominator",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "text"
      },
      {
        "name": "extension_effective_as_printed",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "text"
      },
      {
        "name": "non_business_day_maturity_adjustment",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "text"
      },
      {
        "name": "conditions",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "list",
        "item": {
          "type": "text"
        }
      },
      {
        "name": "replacement_lenders_reference",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "text"
      }
    ],
    "path": "facility.maturity_extension_terms"
  },
  {
    "description": "Extract the minimum requested borrowing and permitted excess increment for each loan type and currency.",
    "type": "list",
    "item": {
      "type": "object",
      "properties": [
        {
          "name": "loan_type",
          "description": "",
          "enum_values": [],
          "expected_format": "",
          "required": false,
          "type": "text"
        },
        {
          "name": "currency",
          "description": "",
          "enum_values": [],
          "expected_format": "",
          "required": false,
          "type": "text"
        },
        {
          "name": "minimum",
          "description": "",
          "enum_values": [],
          "expected_format": "",
          "required": false,
          "type": "number"
        },
        {
          "name": "increment",
          "description": "",
          "enum_values": [],
          "expected_format": "",
          "required": false,
          "type": "number"
        }
      ]
    },
    "path": "facility.minimum_borrowing_amounts"
  },
  {
    "description": "Extract all six rating levels with annual facility fee and LIBOR/transitioned RFR, Sterling RFR, Swiss franc RFR and base-rate margins as percentage numbers.",
    "type": "list",
    "item": {
      "type": "object",
      "properties": [
        {
          "name": "pricing_level",
          "description": "",
          "enum_values": [],
          "expected_format": "",
          "required": false,
          "type": "text"
        },
        {
          "name": "debt_rating",
          "description": "",
          "enum_values": [],
          "expected_format": "",
          "required": false,
          "type": "text"
        },
        {
          "name": "facility_fee_percent",
          "description": "",
          "enum_values": [],
          "expected_format": "",
          "required": false,
          "type": "number"
        },
        {
          "name": "libor_and_transitioned_rfr_margin_percent",
          "description": "",
          "enum_values": [],
          "expected_format": "",
          "required": false,
          "type": "number"
        },
        {
          "name": "initial_rfr_sterling_margin_percent",
          "description": "",
          "enum_values": [],
          "expected_format": "",
          "required": false,
          "type": "number"
        },
        {
          "name": "initial_rfr_swiss_francs_margin_percent",
          "description": "",
          "enum_values": [],
          "expected_format": "",
          "required": false,
          "type": "number"
        },
        {
          "name": "base_rate_margin_percent",
          "description": "",
          "enum_values": [],
          "expected_format": "",
          "required": false,
          "type": "number"
        }
      ]
    },
    "path": "pricing.applicable_margin_grid"
  },
  {
    "description": "Extract rating basis, agencies, effective timing, split-rating rules and disruption treatment.",
    "type": "object",
    "properties": [
      {
        "name": "rating_basis",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "text"
      },
      {
        "name": "rating_agencies",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "list",
        "item": {
          "type": "text"
        }
      },
      {
        "name": "rules_as_stated",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "text"
      }
    ],
    "path": "pricing.rating_selection_rules"
  },
  {
    "description": "Extract the used/unused commitment fee basis, payment frequency and post-termination accrual rule.",
    "type": "object",
    "properties": [
      {
        "name": "basis",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "text"
      },
      {
        "name": "rate_reference",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "text"
      },
      {
        "name": "payment_terms",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "text"
      },
      {
        "name": "post_termination_basis",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "text"
      }
    ],
    "path": "pricing.facility_fee_basis"
  },
  {
    "description": "Extract the highest-of Base Rate formula, component spreads, floor and exclusions, retaining the printed LIBOR cross-reference.",
    "type": "object",
    "properties": [
      {
        "name": "selection",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "text"
      },
      {
        "name": "components",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "list",
        "item": {
          "type": "object",
          "properties": [
            {
              "name": "rate",
              "description": "",
              "enum_values": [],
              "expected_format": "",
              "required": false,
              "type": "text"
            },
            {
              "name": "spread_percentage_points",
              "description": "",
              "enum_values": [],
              "expected_format": "",
              "required": false,
              "type": "number"
            },
            {
              "name": "period",
              "description": "",
              "enum_values": [],
              "expected_format": "",
              "required": false,
              "type": "text"
            },
            {
              "name": "definition_cross_reference_as_printed",
              "description": "",
              "enum_values": [],
              "expected_format": "",
              "required": false,
              "type": "text"
            }
          ]
        }
      },
      {
        "name": "floor_percent",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "number"
      },
      {
        "name": "clause_c_exclusion",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "text"
      },
      {
        "name": "prime_rate_source",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "text"
      }
    ],
    "path": "pricing.base_rate_components"
  },
  {
    "description": "Extract the default-rate increment, automatic/elective triggers and fallback for obligations without a stated rate.",
    "type": "object",
    "properties": [
      {
        "name": "increment_percentage_points",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "number"
      },
      {
        "name": "automatic_event_of_default_sections",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "list",
        "item": {
          "type": "text"
        }
      },
      {
        "name": "other_event_of_default_trigger",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "text"
      },
      {
        "name": "rate_basis",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "text"
      },
      {
        "name": "no_stated_rate_basis",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "text"
      }
    ],
    "path": "pricing.default_rate_terms"
  },
  {
    "description": "Extract the benchmark replacement waterfall, SOFR adjustments, floor, administrative-feasibility condition and implementation/objection mechanism.",
    "type": "object",
    "properties": [
      {
        "name": "dollar_libor_transition_waterfall",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "list",
        "item": {
          "type": "text"
        }
      },
      {
        "name": "term_rfr_feasibility_condition",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "text"
      },
      {
        "name": "other_benchmark_transition_basis",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "text"
      },
      {
        "name": "term_rfr_transition_replacement",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "text"
      },
      {
        "name": "other_benchmark_rate_election_basis",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "text"
      },
      {
        "name": "daily_sofr_adjustment_percentage_points",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "number"
      },
      {
        "name": "term_sofr_adjustments_percentage_points",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "object",
        "properties": [
          {
            "name": "one_month",
            "description": "",
            "enum_values": [],
            "expected_format": "",
            "required": false,
            "type": "number"
          },
          {
            "name": "three_months",
            "description": "",
            "enum_values": [],
            "expected_format": "",
            "required": false,
            "type": "number"
          },
          {
            "name": "six_months",
            "description": "",
            "enum_values": [],
            "expected_format": "",
            "required": false,
            "type": "number"
          }
        ]
      },
      {
        "name": "floor_percent",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "number"
      },
      {
        "name": "dollar_waterfall_first_two_implementation",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "text"
      },
      {
        "name": "alternative_benchmark_objection_deadline_business_days",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "number"
      },
      {
        "name": "objecting_lenders",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "text"
      },
      {
        "name": "term_rfr_notice_to_transition_calendar_days",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "number"
      }
    ],
    "path": "pricing.benchmark_replacement_basis"
  },
  {
    "description": "Extract permitted future ESG pricing decreases and amendment consent/target prerequisites.",
    "type": "object",
    "properties": [
      {
        "name": "facility_fee_maximum_decrease_percentage_points",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "number"
      },
      {
        "name": "applicable_margin_maximum_decrease_percentage_points",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "number"
      },
      {
        "name": "lc_commission_maximum_decrease_percentage_points",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "number"
      },
      {
        "name": "amendment_parties",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "list",
        "item": {
          "type": "text"
        }
      },
      {
        "name": "target_alternatives",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "list",
        "item": {
          "type": "text"
        }
      },
      {
        "name": "application_condition",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "text"
      }
    ],
    "path": "pricing.esg_pricing_adjustments"
  },
  {
    "description": "Extract the numerical L/C fronting-fee rate payable to each Issuing Lender.",
    "type": "number",
    "path": "pricing.lc_fronting_fee_rate"
  },
  {
    "description": "Extract every financial maintenance ratio level, components, test timing, valuation rules, net-worth adjustments and accounting/rounding rules.",
    "type": "object",
    "properties": [
      {
        "name": "numerator",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "text"
      },
      {
        "name": "denominator",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "text"
      },
      {
        "name": "maximum_ratio",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "number"
      },
      {
        "name": "ratio_denominator",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "number"
      },
      {
        "name": "test_timing",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "text"
      },
      {
        "name": "total_capitalization_components",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "list",
        "item": {
          "type": "text"
        }
      },
      {
        "name": "indebtedness_measurement",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "text"
      },
      {
        "name": "net_worth_basis",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "text"
      },
      {
        "name": "interim_net_worth_adjustments",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "text"
      },
      {
        "name": "rounding_rule",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "text"
      },
      {
        "name": "lease_accounting_rule",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "text"
      },
      {
        "name": "compliance_certificate_delivery",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "text"
      }
    ],
    "path": "covenants.financial.maximum_leverage_ratio"
  },
  {
    "description": "Extract any minimum interest coverage ratio imposed as a financial covenant.",
    "type": "number",
    "path": "covenants.financial.minimum_interest_coverage_ratio"
  },
  {
    "description": "Extract the additional-liens basket amount, asset-percentage alternative and printed cross-reference without correcting it.",
    "type": "object",
    "properties": [
      {
        "name": "dollar_floor",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "number"
      },
      {
        "name": "asset_percentage",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "number"
      },
      {
        "name": "asset_base",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "text"
      },
      {
        "name": "comparison",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "text"
      },
      {
        "name": "test_timing",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "text"
      },
      {
        "name": "excluded_amounts",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "text"
      },
      {
        "name": "printed_obligations_reference",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "text"
      },
      {
        "name": "containing_section",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "text"
      }
    ],
    "path": "covenants.negative.additional_liens_basket"
  },
  {
    "description": "Extract the subsidiary unsecured-debt standalone limit, default condition and combined-cap cross-reference.",
    "type": "object",
    "properties": [
      {
        "name": "dollar_floor",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "number"
      },
      {
        "name": "asset_percentage",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "number"
      },
      {
        "name": "asset_base",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "text"
      },
      {
        "name": "comparison",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "text"
      },
      {
        "name": "test_timing",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "text"
      },
      {
        "name": "default_condition",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "text"
      },
      {
        "name": "also_subject_to_combined_cap_with",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "text"
      }
    ],
    "path": "covenants.negative.subsidiary_unsecured_debt_basket"
  },
  {
    "description": "Extract the secured-debt standalone limit, default condition and combined-cap cross-reference.",
    "type": "object",
    "properties": [
      {
        "name": "dollar_floor",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "number"
      },
      {
        "name": "asset_percentage",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "number"
      },
      {
        "name": "asset_base",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "text"
      },
      {
        "name": "comparison",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "text"
      },
      {
        "name": "test_timing",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "text"
      },
      {
        "name": "default_condition",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "text"
      },
      {
        "name": "also_subject_to_combined_cap_with",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "text"
      }
    ],
    "path": "covenants.negative.secured_debt_basket"
  },
  {
    "description": "Extract the shared aggregate cap on debt incurred under Sections 8.4(ii) and 8.4(iii).",
    "type": "object",
    "properties": [
      {
        "name": "dollar_floor",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "number"
      },
      {
        "name": "asset_percentage",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "number"
      },
      {
        "name": "asset_base",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "text"
      },
      {
        "name": "comparison",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "text"
      },
      {
        "name": "covered_sections",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "list",
        "item": {
          "type": "text"
        }
      },
      {
        "name": "test_timing",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "text"
      }
    ],
    "path": "covenants.negative.combined_secured_and_subsidiary_unsecured_debt_cap"
  },
  {
    "description": "Extract the aggregate fixed/capital-asset and capital-lease debt basket, including purchase-money debt within it.",
    "type": "object",
    "properties": [
      {
        "name": "dollar_floor",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "number"
      },
      {
        "name": "asset_percentage",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "number"
      },
      {
        "name": "asset_base",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "text"
      },
      {
        "name": "comparison",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "text"
      },
      {
        "name": "covered_sections",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "list",
        "item": {
          "type": "text"
        }
      },
      {
        "name": "measurement",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "text"
      }
    ],
    "path": "covenants.negative.fixed_asset_and_capital_lease_debt_basket"
  },
  {
    "description": "Extract the purchase-money debt sublimit and resolve its lien-section reference, timing and collateral restriction.",
    "type": "object",
    "properties": [
      {
        "name": "dollar_floor",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "number"
      },
      {
        "name": "asset_percentage",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "number"
      },
      {
        "name": "asset_base",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "text"
      },
      {
        "name": "comparison",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "text"
      },
      {
        "name": "debt_description",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "text"
      },
      {
        "name": "measurement",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "text"
      },
      {
        "name": "lien_placement_deadline_days_after_acquisition",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "number"
      },
      {
        "name": "collateral_limitation",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "text"
      }
    ],
    "path": "covenants.negative.purchase_money_debt_sub_basket"
  },
  {
    "description": "Extract the Attributable Securitization Indebtedness cap and outstanding-balance test.",
    "type": "object",
    "properties": [
      {
        "name": "amount",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "number"
      },
      {
        "name": "currency",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "text"
      },
      {
        "name": "debt_type",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "text"
      },
      {
        "name": "test_timing",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "text"
      }
    ],
    "path": "covenants.negative.securitization_debt_basket"
  },
  {
    "description": "Extract conditions for cash Dividends under Section 8.3(ii), including when the default condition is tested.",
    "type": "object",
    "properties": [
      {
        "name": "default_test_time",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "text"
      },
      {
        "name": "default_condition",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "text"
      },
      {
        "name": "payment_constraints",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "list",
        "item": {
          "type": "text"
        }
      },
      {
        "name": "specified_default_sections",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "list",
        "item": {
          "type": "text"
        }
      }
    ],
    "path": "covenants.negative.cash_dividend_conditions"
  },
  {
    "description": "Extract payment-default grace periods separately for principal, interest, reimbursement obligations and fees.",
    "type": "object",
    "properties": [
      {
        "name": "loan_or_note_principal",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "object",
        "properties": [
          {
            "name": "grace_period_business_days",
            "description": "",
            "enum_values": [],
            "expected_format": "",
            "required": false,
            "type": "number"
          },
          {
            "name": "trigger",
            "description": "",
            "enum_values": [],
            "expected_format": "",
            "required": false,
            "type": "text"
          }
        ]
      },
      {
        "name": "loan_or_note_interest",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "object",
        "properties": [
          {
            "name": "grace_period_business_days",
            "description": "",
            "enum_values": [],
            "expected_format": "",
            "required": false,
            "type": "number"
          }
        ]
      },
      {
        "name": "reimbursement_obligations",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "object",
        "properties": [
          {
            "name": "grace_period_business_days",
            "description": "",
            "enum_values": [],
            "expected_format": "",
            "required": false,
            "type": "number"
          }
        ]
      },
      {
        "name": "fees",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "object",
        "properties": [
          {
            "name": "grace_period_business_days",
            "description": "",
            "enum_values": [],
            "expected_format": "",
            "required": false,
            "type": "number"
          }
        ]
      },
      {
        "name": "grace_expiry_wording",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "text"
      }
    ],
    "path": "events_of_default.payment_grace_periods"
  },
  {
    "description": "Extract other-indebtedness default threshold, aggregation, comparator and grace/acceleration terms.",
    "type": "object",
    "properties": [
      {
        "name": "aggregate_principal_threshold",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "number"
      },
      {
        "name": "currency",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "text"
      },
      {
        "name": "comparison",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "text"
      },
      {
        "name": "excluded_indebtedness",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "text"
      },
      {
        "name": "covered_parties",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "text"
      },
      {
        "name": "payment_default_timing",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "text"
      },
      {
        "name": "nonpayment_default_effect",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "text"
      },
      {
        "name": "notice_and_grace_rule",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "text"
      },
      {
        "name": "early_maturity_or_prepayment_exception",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "text"
      }
    ],
    "path": "events_of_default.cross_default"
  },
  {
    "description": "Extract judgment-default amount, insurance exclusion, finality alternative and consecutive-day condition.",
    "type": "object",
    "properties": [
      {
        "name": "aggregate_threshold",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "number"
      },
      {
        "name": "currency",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "text"
      },
      {
        "name": "comparison",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "text"
      },
      {
        "name": "covered_parties",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "text"
      },
      {
        "name": "liability_qualifier",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "text"
      },
      {
        "name": "alternatives",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "list",
        "item": {
          "type": "text"
        }
      },
      {
        "name": "consecutive_calendar_days",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "number"
      }
    ],
    "path": "events_of_default.judgments"
  },
  {
    "description": "Extract ownership, director-election, continuing-director and Senior Notes change-of-control triggers.",
    "type": "object",
    "properties": [
      {
        "name": "beneficial_ownership_threshold_percent",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "number"
      },
      {
        "name": "ownership_comparison",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "text"
      },
      {
        "name": "ownership_basis",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "text"
      },
      {
        "name": "person_or_group_reference",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "text"
      },
      {
        "name": "beneficial_owner_reference",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "text"
      },
      {
        "name": "other_triggers",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "list",
        "item": {
          "type": "text"
        }
      },
      {
        "name": "continuing_directors_definition",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "text"
      },
      {
        "name": "event_of_default_reference",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "text"
      }
    ],
    "path": "events_of_default.change_of_control"
  },
  {
    "description": "Extract Required Lenders threshold, strict comparator, pre/post-termination denominators and defaulting-lender exclusion.",
    "type": "object",
    "properties": [
      {
        "name": "threshold_percent",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "number"
      },
      {
        "name": "comparison",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "text"
      },
      {
        "name": "before_termination_denominator",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "text"
      },
      {
        "name": "after_termination_denominator",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "text"
      },
      {
        "name": "excluded_lenders",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "text"
      }
    ],
    "path": "lenders_and_voting.required_lenders"
  },
  {
    "description": "Extract the ordinary minimum assignment amount and complete-assignment, affiliate/fund and consent exceptions.",
    "type": "object",
    "properties": [
      {
        "name": "amount",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "number"
      },
      {
        "name": "currency",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "text"
      },
      {
        "name": "no_minimum_cases",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "list",
        "item": {
          "type": "text"
        }
      },
      {
        "name": "consent_exception_parties",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "list",
        "item": {
          "type": "text"
        }
      },
      {
        "name": "borrower_consent_condition",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "text"
      },
      {
        "name": "valuation_time",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "text"
      }
    ],
    "path": "lenders_and_voting.minimum_assignment_amount"
  },
  {
    "description": "Extract the assignment processing fee, simultaneous-Approved-Fund rule and waiver discretion.",
    "type": "object",
    "properties": [
      {
        "name": "amount",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "number"
      },
      {
        "name": "currency",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "text"
      },
      {
        "name": "basis",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "text"
      },
      {
        "name": "simultaneous_approved_funds_rule",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "text"
      },
      {
        "name": "waiver",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "text"
      }
    ],
    "path": "lenders_and_voting.assignment_fee"
  },
  {
    "description": "Extract Defaulting Lender triggers, qualifications, voting/fee consequences, fronting protections, cure and termination rules.",
    "type": "object",
    "properties": [
      {
        "name": "funding_failure_business_days",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "number"
      },
      {
        "name": "other_payment_failure_business_days",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "number"
      },
      {
        "name": "definition_as_stated",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "text"
      },
      {
        "name": "voting_rule",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "text"
      },
      {
        "name": "voting_exceptions",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "list",
        "item": {
          "type": "text"
        }
      },
      {
        "name": "facility_fee_entitlement",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "boolean"
      },
      {
        "name": "fronting_exposure_rules",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "list",
        "item": {
          "type": "text"
        }
      },
      {
        "name": "cure_parties",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "list",
        "item": {
          "type": "text"
        }
      },
      {
        "name": "cure_requires",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "text"
      },
      {
        "name": "unused_commitment_termination_notice_business_days",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "number"
      },
      {
        "name": "termination_condition",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "text"
      }
    ],
    "path": "lenders_and_voting.defaulting_lender_basics"
  },
  {
    "description": "Extract the borrower notice address, primary attention/telephone/fax and both copy contacts.",
    "type": "object",
    "properties": [
      {
        "name": "name",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "text"
      },
      {
        "name": "street",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "text"
      },
      {
        "name": "city",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "text"
      },
      {
        "name": "state",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "text"
      },
      {
        "name": "postal_code",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "text"
      },
      {
        "name": "attention",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "text"
      },
      {
        "name": "telephone",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "text"
      },
      {
        "name": "telecopy",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "text"
      },
      {
        "name": "copies",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "list",
        "item": {
          "type": "object",
          "properties": [
            {
              "name": "attention",
              "description": "",
              "enum_values": [],
              "expected_format": "",
              "required": false,
              "type": "text"
            },
            {
              "name": "telephone",
              "description": "",
              "enum_values": [],
              "expected_format": "",
              "required": false,
              "type": "text"
            },
            {
              "name": "telecopy",
              "description": "",
              "enum_values": [],
              "expected_format": "",
              "required": false,
              "type": "text"
            }
          ]
        }
      }
    ],
    "path": "notices.borrower"
  },
  {
    "description": "Extract the administrative agent notice address/contact details and the Atlanta copy recipient.",
    "type": "object",
    "properties": [
      {
        "name": "name",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "text"
      },
      {
        "name": "mail_code",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "text"
      },
      {
        "name": "street",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "text"
      },
      {
        "name": "city",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "text"
      },
      {
        "name": "state",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "text"
      },
      {
        "name": "postal_code",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "text"
      },
      {
        "name": "attention",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "text"
      },
      {
        "name": "telecopier",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "text"
      },
      {
        "name": "telephone",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "text"
      },
      {
        "name": "email",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "text"
      },
      {
        "name": "copies",
        "description": "",
        "enum_values": [],
        "expected_format": "",
        "required": false,
        "type": "list",
        "item": {
          "type": "object",
          "properties": [
            {
              "name": "name",
              "description": "",
              "enum_values": [],
              "expected_format": "",
              "required": false,
              "type": "text"
            },
            {
              "name": "mail_code",
              "description": "",
              "enum_values": [],
              "expected_format": "",
              "required": false,
              "type": "text"
            },
            {
              "name": "street",
              "description": "",
              "enum_values": [],
              "expected_format": "",
              "required": false,
              "type": "text"
            },
            {
              "name": "city",
              "description": "",
              "enum_values": [],
              "expected_format": "",
              "required": false,
              "type": "text"
            },
            {
              "name": "state",
              "description": "",
              "enum_values": [],
              "expected_format": "",
              "required": false,
              "type": "text"
            },
            {
              "name": "postal_code",
              "description": "",
              "enum_values": [],
              "expected_format": "",
              "required": false,
              "type": "text"
            },
            {
              "name": "attention",
              "description": "",
              "enum_values": [],
              "expected_format": "",
              "required": false,
              "type": "text"
            },
            {
              "name": "telecopier",
              "description": "",
              "enum_values": [],
              "expected_format": "",
              "required": false,
              "type": "text"
            },
            {
              "name": "telephone",
              "description": "",
              "enum_values": [],
              "expected_format": "",
              "required": false,
              "type": "text"
            },
            {
              "name": "email",
              "description": "",
              "enum_values": [],
              "expected_format": "",
              "required": false,
              "type": "text"
            }
          ]
        }
      }
    ],
    "path": "notices.administrative_agent"
  }
]
]=]))
end }
