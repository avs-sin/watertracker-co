//
//  AppConfig.swift
//  WaterTracker
//
//  Created by Apps4World on 12/14/23.
//

import TipKit
import SwiftUI
import Foundation

/// Generic configurations for the app
class AppConfig {

    /// This is the AdMob Interstitial ad id
    /// Test App ID: ca-app-pub-3940256099942544~1458002511
    static let adMobAdId: String = "ca-app-pub-3940256099942544/4411468910"

    // MARK: - Generic Configurations
    static let ozMl: Double = 29.574
    static let widgetGlassDrink: Double = 8.0 /// in oz (not ml)
    static let defaultDrinks: [DrinkType] = AppConfig.freeDrinks
    static let avatars: [String] = ["avatar-01", "avatar-02", "avatar-03", "avatar-04", "avatar-05", "avatar-06", "avatar-07", "avatar-08", "avatar-09", "avatar-10", "avatar-11", "avatar-12", "avatar-13", "avatar-14", "avatar-15", "avatar-16", "avatar-17", "avatar-18", "avatar-19", "avatar-20", "avatar-21", "avatar-22", "avatar-23", "avatar-24", "avatar-25", "avatar-26"]

    // MARK: - Settings flow items
    static let emailSupport = "support@apps4world.com"
    static let privacyURL: URL = URL(string: "https://www.google.com/")!
    static let termsAndConditionsURL: URL = URL(string: "https://www.google.com/")!
    static let yourAppURL: URL = URL(string: "https://apps.apple.com/app/idXXXXXXXXX")!

    // MARK: - In App Purchases
    static let premiumVersion: String = "WaterTracker.Premium"
    static let freeDrinks: [DrinkType] = [.water, .coffee, .tea]
    static let waterIntakeCount: Int = 2

    // MARK: - App Group identifier
    static let appGroup: String = Bundle.main.object(forInfoDictionaryKey: "APP_GROUP_IDENTIFIER") as! String

    // MARK: - Shared UserDefaults
    static var userDefaults: UserDefaults? {
        guard let value = Bundle.main.object(forInfoDictionaryKey: "APP_GROUP_IDENTIFIER") as? String else { return nil }
        return UserDefaults(suiteName: value)
    }
}

// MARK: - First Launch Tips
struct GetStartedTip: Tip {
    var title: Text { Text("Get Started") }
    var message: Text? { Text("Set your username and daily goal") }
}

// MARK: - Full Screen flow
enum FullScreenMode: Int, Identifiable {
    case premium, settings, drinks, history
    var id: Int { hashValue }
}

// MARK: - Fluid Units
enum FluidUnit: String, CaseIterable, Identifiable {
    case oz, ml
    var id: Int { hashValue }
}

// MARK: - Drink Types
enum DrinkType: String, CaseIterable, Identifiable {
    case water, coffee, tea, juice, soda, milk
    case smoothie, sportsDrink = "Energy"
    case icedDrink = "Iced", lemonade = "Citrus"
    case wine, beer, cocktail, bobaTea = "Boba", champagne = "Bubbly"
    var id: Int { hashValue }

    /// Drink emoji
    var emoji: String {
        switch self {
        case .water: return "💧"
        case .coffee: return "☕️"
        case .juice: return "🧃"
        case .tea: return "🫖"
        case .soda: return "🥤"
        case .milk: return "🥛"
        case .smoothie: return "🍹"
        case .sportsDrink: return "🏋️‍♂️"
        case .icedDrink: return "🧊"
        case .lemonade: return "🍋"
        case .wine: return "🍷"
        case .beer: return "🍺"
        case .cocktail: return "🍸"
        case .bobaTea: return "🧋"
        case .champagne: return "🥂"
        }
    }

    /// Widget button title
    var buttonTitle: String {
        switch self {
        case .water, .milk, .juice, .smoothie, .icedDrink, .lemonade, .wine, .beer, .cocktail, .champagne:
            return "Add Glass"
        case .coffee, .tea, .bobaTea:
            return "Add Cup"
        case .soda:
            return "Add Can"
        case .sportsDrink:
            return "Add Bottle"
        }
    }

    /// Get the next drink type
    func next() -> DrinkType {
        let allCases = DrinkType.allCases
        if let currentIndex = allCases.firstIndex(of: self) {
            let nextIndex = (currentIndex + 1) % allCases.count
            return allCases[nextIndex]
        }
        return self
    }

    /// Get the previous drink type
    func previous() -> DrinkType {
        let allCases = DrinkType.allCases
        if let currentIndex = allCases.firstIndex(of: self) {
            let previousIndex = (currentIndex - 1 + allCases.count) % allCases.count
            return allCases[previousIndex]
        }
        return self
    }
}
