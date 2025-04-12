//
//  TrackIntent.swift
//  WaterTracker
//
//  Created by Apps4World on 12/14/23.
//

import Foundation
import AppIntents
import WidgetKit

/// Handle tracking intent
struct TrackIntent: AppIntent {

    static var title: LocalizedStringResource = "WaterTracker"
    static var description: IntentDescription = IntentDescription("WaterTracker Widget")

    @Parameter(title: "Intent")
    var intent: String

    init() { }
    init(intent: TrackingIntentType, customDrink: String? = nil) {
        self.intent = customDrink ?? intent.rawValue
    }

    func perform() async throws -> some IntentResult {
        if let type = TrackingIntentType(rawValue: intent) {
            switch type {
            case .addGlass:
                await DataManager(preview: false).submitGlass()
            case .nextDrink:
                DataManager().currentWidgetDrink = DataManager().currentWidgetDrink.next()
            case .previousDrink:
                DataManager().currentWidgetDrink = DataManager().currentWidgetDrink.previous()
            case .showHideGlassView:
                DataManager().showAddGlassView.toggle()
            default: break
            }
        } else if let customDrink = DrinkType(rawValue: intent) {
            await DataManager(preview: false).submitGlass(drinkType: customDrink)
        }
        return .result()
    }
}

/// Tracking intent type
enum TrackingIntentType: String {
    case none
    case addGlass
    case nextDrink, previousDrink
    case showHideGlassView
}
