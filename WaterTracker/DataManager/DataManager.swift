//
//  DataManager.swift
//  WaterTracker
//
//  Created by Apps4World on 12/14/23.
//

import SwiftUI
import SwiftData
import Foundation

/// Main data manager for the app
class DataManager: NSObject, ObservableObject {

    /// Dynamic properties that the UI will react to
    @Published var fullScreenMode: FullScreenMode?
    @Published var drinksData: [DrinkIntake] = [DrinkIntake]()

    /// Dynamic properties that the UI will react to AND store values in UserDefaults
    @AppStorage("username") var username: String = "Your Name"
    @AppStorage("intakeAmount") var intakeAmount: Double = 0.0
    @AppStorage("avatarName") var avatarName: String = AppConfig.avatars[0]
    @AppStorage("selectedDrink") var selectedDrink: DrinkType = .water
    @AppStorage("selectedRecentDrink") var selectedRecentDrink: DrinkType = .water
    @AppStorage("fluidUnits", store: AppConfig.userDefaults) var fluidUnits: String = FluidUnit.oz.rawValue
    @AppStorage("dailyIntakeGoal", store: AppConfig.userDefaults) var dailyIntakeGoal: Double = 100.0
    @AppStorage("todayIntakeAmount", store: AppConfig.userDefaults) var todayIntakeAmount: Double = 0.0
    @AppStorage("showAddGlassView", store: AppConfig.userDefaults) var showAddGlassView: Bool = false
    @AppStorage("currentWidgetDrink", store: AppConfig.userDefaults) var currentWidgetDrink: DrinkType = .tea
    @AppStorage(AppConfig.premiumVersion, store: AppConfig.userDefaults) var isPremiumUser: Bool = true {
        didSet {
            #if !(WIDGET)
            Interstitial.shared.isPremiumUser = isPremiumUser
            #endif
        }
    }

    /// SwiftData model container
    private var container: ModelContainer?

    /// Default initializer
    init(preview: Bool = true) {
        super.init()
        guard preview == false else {
            let previewConfiguration = ModelConfiguration(for: DrinkIntake.self, isStoredInMemoryOnly: true)
            container = try? ModelContainer(for: DrinkIntake.self, configurations: previewConfiguration)
            return
        }
        let groupContainer = ModelConfiguration.GroupContainer.identifier(AppConfig.appGroup)
        let configuration = ModelConfiguration(groupContainer: groupContainer)
        container = try? ModelContainer(for: DrinkIntake.self, configurations: configuration)
        fetchTodayDrinkData()
        #if !(WIDGET)
        Interstitial.shared.loadInterstitial()
        #endif
    }

    /// Greetings text based on the time of day
    var greetingText: String {
        let hour = Calendar.current.component(.hour, from: Date())

        let newDay = 0
        let noon = 12
        let sunset = 18
        let midnight = 24

        var greetingText = "Good day"

        switch hour {
        case newDay..<noon:
            greetingText = "Good morning"
        case noon..<sunset:
            greetingText = "Good afternoon"
        case sunset..<midnight:
            greetingText = "Good evening"
        default: break
        }

        return greetingText
    }

    /// Most common drinks
    var commonDrinks: [DrinkType] {
        var primaryItems: [DrinkType] = [selectedRecentDrink]
        if !AppConfig.defaultDrinks.prefix(3).contains(selectedRecentDrink) {
            primaryItems.append(contentsOf: AppConfig.defaultDrinks.filter({ $0 != selectedRecentDrink }))
            return primaryItems
        }
        return AppConfig.defaultDrinks
    }

    /// Present AdMob Interstitial ads
    func presentInterstitialAds() {
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.0) {
            #if !(WIDGET)
            Interstitial.shared.showInterstitialAds()
            #endif
        }
    }
}

// MARK: - Handle Drink Data
extension DataManager {

    /// Submit current drink type and amount
    @MainActor func submitDrink() {
        let exactAmount = Double(Int(intakeAmount))
        let drink: DrinkIntake = DrinkIntake(date: .now, amount: exactAmount, type: selectedDrink.rawValue)
        container?.mainContext.insert(drink)
        fetchTodayDrinkData()
        presentInterstitialAds()
    }

    /// Submit a glass from widget
    @MainActor func submitGlass(drinkType: DrinkType = .water) {
        let glassAmount: Double = AppConfig.widgetGlassDrink
        let drink: DrinkIntake = DrinkIntake(date: .now, amount: glassAmount, type: drinkType.rawValue)
        container?.mainContext.insert(drink)
        fetchTodayDrinkData()
        showAddGlassView = false
    }

    /// Refresh data if needed
    func refreshDataIfNeeded() {
        if fullScreenMode == .history {
            fetchAllDrinksData()
        } else {
            fetchTodayDrinkData()
        }
    }

    /// Fetch today drink data
    func fetchTodayDrinkData() {
        let todayDrinks = FetchDescriptor<DrinkIntake>(predicate: .todayDrinks)
        DispatchQueue.main.async {
            if let results = try? self.container?.mainContext.fetch(todayDrinks) {
                self.drinksData = results
                self.todayIntakeAmount = results.compactMap({ $0.amount }).reduce(0, +)
            }
        }
    }

    /// Fetch all drinks
    func fetchAllDrinksData() {
        DispatchQueue.main.async {
            if let results = try? self.container?.mainContext.fetch(FetchDescriptor<DrinkIntake>()) {
                self.drinksData = results
                self.presentInterstitialAds()
            }
        }
    }
}

// MARK: - History Data
extension DataManager {

    /// Daily average of drink intake
    var dailyAverage: String {
        let days: [String] = drinksData.filter({ $0.amount > 0 }).compactMap({ $0.date.date })
        var dailyData: [Double] = [Double]()
        Set(days).forEach { day in
            let dayEntries = drinksData.filter({ $0.date.date == day }).compactMap({ $0.amount })
            dailyData.append(dayEntries.reduce(0, +) / Double(dayEntries.count))
        }
        guard dailyData.count != 0 else { return "- -" }
        let average = dailyData.reduce(0, +) / Double(dailyData.count)
        if fluidUnits != FluidUnit.oz.rawValue {
            return "\(Int(Double(average) * AppConfig.ozMl)) ml/day"
        }
        return "\(Int(average)) oz/day"
    }

    /// Daily drinks frequency
    var dailyFrequency: String {
        let days: [String] = drinksData.filter({ $0.amount > 0 }).compactMap({ $0.date.date })
        var dailyData: [Double] = [Double]()
        Set(days).forEach { day in
            dailyData.append(Double(drinksData.filter({ $0.date.date == day }).count))
        }
        guard dailyData.count != 0 else { return "- -" }
        let averageDrinksCount = dailyData.reduce(0, +) / Double(dailyData.count)
        return "\(Int(averageDrinksCount)) times/day"
    }

    /// Daily goal completion
    var dailyCompletion: String {
        let days: [String] = drinksData.filter({ $0.amount > 0 }).compactMap({ $0.date.date })
        var dailyData: [Double] = [Double]()
        Set(days).forEach { day in
            let totalDaily = drinksData.filter({ $0.date.date == day }).compactMap({ $0.amount }).reduce(0, +)
            dailyData.append(min((totalDaily / dailyIntakeGoal), 1.0))
        }
        guard dailyData.count != 0 else { return "- -" }
        let averageCompletion = (dailyData.reduce(0, +) / Double(dailyData.count)) * 100.0
        return String(format: "%.0f%%", averageCompletion)
    }

    /// Top drinks
    var topDrinks: [DrinkType: Int] {
        let days: [String] = drinksData.filter({ $0.amount > 0 }).compactMap({ $0.date.date })
        var dailyData: [DrinkType: Int] = Dictionary(uniqueKeysWithValues: DrinkType.allCases.map { ($0, 0) })
        Set(days).forEach { day in
            drinksData.filter({ $0.date.date == day }).forEach { drink in
                if let type = DrinkType(rawValue: drink.type) {
                    dailyData[type]! += 1
                }
            }
        }
        return dailyData
    }
}

/// Custom predicate for SwiftData
extension Predicate<DrinkIntake> {
    static var todayDrinks: Predicate<DrinkIntake> {
        let startOfDay: Date = Calendar.current.startOfDay(for: .now)
        let endOfDay: Date = Calendar.current.date(byAdding: .day, value: 1, to: startOfDay)!
        return #Predicate { $0.date >= startOfDay && $0.date < endOfDay }
    }
}
