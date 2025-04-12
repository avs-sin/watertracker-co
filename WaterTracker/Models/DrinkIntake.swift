//
//  DrinkIntake.swift
//  WaterTracker
//
//  Created by Apps4World on 12/14/23.
//

import SwiftData
import Foundation

@Model
class DrinkIntake: Identifiable {
    @Attribute(.unique) var date: Date
    var amount: Double
    var type: String

    /// Initialize the model with a unique date and intake amount
    /// - Parameters:
    ///   - date: date when the user logged their drink intake
    ///   - amount: drink intake amount
    ///   - type: drink type
    init(date: Date, amount: Double, type: String) {
        self.date = date
        self.amount = amount
        self.type = type
    }

    /// Converted amount
    var convertedAmount: Double {
        let fluidUnits: String = AppConfig.userDefaults?.string(forKey: "fluidUnits") ?? FluidUnit.oz.rawValue
        if fluidUnits != FluidUnit.oz.rawValue {
            return amount * AppConfig.ozMl
        }
        return amount
    }
}

// MARK: - Date Formatting
extension Date {
    static func from(_ string: String) -> Date {
        let dateFormatter = DateFormatter()
        dateFormatter.dateFormat = "MM-dd-yyyy h:mm a"
        return dateFormatter.date(from: string) ?? Date()
    }

    func startTime(forHour hour: Int) -> Date {
        Calendar.current.date(bySettingHour: hour, minute: 0, second: 0, of: self)!
    }

    func endTime(forHour hour: Int) -> Date {
        Calendar.current.date(bySettingHour: hour, minute: 59, second: 59, of: self)!
    }

    func startDate(forDay day: Int) -> Date {
        Calendar.current.date(byAdding: .day, value: -day, to: self)!
    }

    var date: String {
        let dateFormatter = DateFormatter()
        dateFormatter.dateFormat = "MM-dd-yyyy"
        return dateFormatter.string(from: self)
    }

    var hour: String {
        let dateFormatter = DateFormatter()
        dateFormatter.dateFormat = "h a"
        return dateFormatter.string(from: self)
    }
}

// MARK: - Format Date string
extension String {
    var dateFormat: String {
        guard let year = components(separatedBy: "-").last else { return self }
        return replacingOccurrences(of: "-\(year)", with: "").replacingOccurrences(of: "-", with: "/")
    }
}
